/**
 * Created by haunguyen on 9/15/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

import ContentView from './slideEditor/contentView.js';
import DesignView from './slideEditor/designView.js';

const SortableItem = SortableElement(({value, onSelectSlide}) => (
  <div className="slide-item-thumb" onClick={onSelectSlide}>
    <Image src="https://firebasestorage.googleapis.com/v0/b/prezvr.appspot.com/o/images%2Fslide-cover3.png?alt=media&token=406ea219-2ef6-46f1-bce0-ab0db17635f4" thumbnail />
    <span>{value.title}</span>
  </div>
));

const SortableList = SortableContainer(({items, onSelectSlide}) => {
  return (
    <ul className="slides-list orderable">
      {items.map((value, index) =>
          <SortableItem onSelectSlide={onSelectSlide} key={`item-${index}`} index={index} value={value} />
      )}
    </ul>
  );
});


class DeckSlides extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      viewState: 1
    };
    this.onSortEnd = this.onSortEnd.bind(this);
    this.getViewActive = this.getViewActive.bind(this);
    this.onSelectSlide = this.onSelectSlide.bind(this)
  }

  onSortEnd({oldIndex, newIndex}){
    const slides = this.getSlides();
    const {deckObject} = this.props;

    const newSlides = arrayMove(slides, oldIndex, newIndex);
    let deckDataRef = firebase.database().ref('deckData/' + deckObject.id + '/slides/');
    deckDataRef.set(newSlides);
  };

  getSlides(){
    const {deckData} = this.props;
    if(deckData && deckData.slides && deckData.slides.length > 0){
      return deckData.slides;
    }
    return [];
  }

  onSwitchView(view){
    this.setState({viewState: view});
  }

  getViewActive(view){
    if(this.state.viewState == view)
      return " active ";
    return "";
  }

  onSelectSlide(slide){
    console.log(slide)
  }

  render(){
    return (
      <div className="deck-slides-component">
        <div className="slides-navigation">
          <div className="slides-header">
            <span className="title">SLIDES</span>
            <span className="add-slide">
              <i className="fa fa-plus-square"></i>
            </span>
          </div>
          <SortableList onSelectSlide={this.onSelectSlide} items={this.getSlides()} onSortEnd={this.onSortEnd}/>

        </div>

        <div className="main-slide-editor">
          <div className="button-group-switch-view">
            <ButtonGroup>
              <Button className={this.getViewActive(1)} onClick={this.onSwitchView.bind(this, 1)}>CONTENT</Button>
              <Button className={this.getViewActive(2)} onClick={this.onSwitchView.bind(this, 2)}>DESIGN</Button>
            </ButtonGroup>
          </div>

          <div className="editor-view col-sm-10 col-sm-offset-1">
            {this.state.viewState == 1?
              <ContentView/> : <DesignView/>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(DeckSlides, {withRef: true});

