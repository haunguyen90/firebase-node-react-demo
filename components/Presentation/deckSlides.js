/**
 * Created by haunguyen on 9/15/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import {map, findWhere, findIndex} from 'underscore';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import ContentView from './slideEditor/contentView.js';
import DesignView from './slideEditor/designView.js';

const SortableItem = SortableElement(({value, selectedSlide}) => {
  let activeClass = "";
  if(selectedSlide.slideId == value.slideId)
    activeClass = "slide-active";

  let title = "";
  if(value.components){
    const titleComponent = findWhere(value.components, {type: "TITLE"});
    if(titleComponent){
      title = titleComponent.text;
    }
  }


  return (
    <div className="slide-item-thumb">
      <Image className={activeClass} src="https://firebasestorage.googleapis.com/v0/b/prezvr.appspot.com/o/images%2Fslide-cover3.png?alt=media&token=406ea219-2ef6-46f1-bce0-ab0db17635f4" thumbnail />
      <span>{title}</span>
    </div>
  )
});

const SortableList = SortableContainer(({items, selectedSlide}) => {
  return (
    <ul className="slides-list orderable">
      <ReactCSSTransitionGroup
        transitionName="slide-animation"
        transitionEnterTimeout={500}
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionLeaveTimeout={300}
      >
        {items.map((value, index) =>
            <SortableItem
              key={`item-${index}`}
              index={index}
              value={value}
              selectedSlide={selectedSlide}
            />
        )}
      </ReactCSSTransitionGroup>
    </ul>
  );
});


class DeckSlides extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      viewState: 1,
      mountDesignView: false,
      selectedSlide: {},
      currentSlideIndex: -1,
      deckData: {}
    };
    this.onSortEnd = this.onSortEnd.bind(this);
    this.getViewActive = this.getViewActive.bind(this);
    this.onSelectSlide = this.onSelectSlide.bind(this);
    this.onAddSlide = this.onAddSlide.bind(this);
    this.getSlides = this.getSlides.bind(this);
    this.updateAssetURL = this.updateAssetURL.bind(this);
  }

  onSortEnd({oldIndex, newIndex}){
    const slides = this.getSlides();
    const {deckObject} = this.props;


    const newSlides = arrayMove(slides, oldIndex, newIndex);
    this.onSelectSlide(newSlides[newIndex]);
    if(oldIndex == newIndex){

    }else{
      let deckDataRef = firebase.database().ref('deckData/' + deckObject.id + '/slides/');
      delete newSlides.keyId;
      deckDataRef.set(newSlides);
      //this.onSelectSlide(newSlides[newIndex]);
    }
  };

  getSlides(hasKeyId = false){
    const {deckData} = this.props;
    if(deckData && deckData.slides && deckData.slides.length > 0){
      return map(deckData.slides, (slide, index) => {
        if(hasKeyId){
          slide.keyId = index;
        }else{
          delete slide.keyId;
        }
        return slide;
      });
    }
    return [];
  }

  onSwitchView(view){
    this.setState({viewState: view});
    if(view == 2 && !this.state.mountDesignView){
      this.setState({mountDesignView: true});
    }
  }

  getViewActive(view){
    if(this.state.viewState == view)
      return " active ";
    return "";
  }

  onSelectSlide(selectedSlide){
    const slides = this.getSlides();
    const currentSlideIndex = findIndex(slides, (slide) => {
      return slide.slideId == selectedSlide.slideId
    });

    if(currentSlideIndex >= 0){
      this.setState({selectedSlide: selectedSlide});
      this.setState({currentSlideIndex: currentSlideIndex});
    }else
      console.error("Could not find the current slide");
  }

  onAddSlide(event){
    event.preventDefault();
    const slides = this.getSlides();

    const deckId = this.props.deckObject.id;
    const slideId = firebase.database().ref('deckData/' + deckId + '/slides/').push().key;

    const newSlide = {
      slideId: slideId,
      type: "COMPONENT",
      components: [
        {
          fontSize: "12pt",
          text: `Title for slide ${slides.length + 1}`,
          type: "TITLE"
        },
        {
          fontSize: "12pt",
          text: "",
          type: "TEXT"
        }
      ]
    };
    slides.push(newSlide);

    // Update firebase database
    let deckDataRef = firebase.database().ref('deckData/' + deckId + '/slides/');
    deckDataRef.set(slides);
  }

  findExistedSlide(keyId){
    const slides = this.getSlides();
    keyId = parseInt(keyId);
    if(isNaN(keyId) || keyId < 0) return false;
    if(slides.length > 0){
      if(slides[keyId]){
        return keyId;
      }else{
        const newKey = keyId - 1;
        return this.findExistedSlide(newKey);
      }
    }
    return false;
  }

  updateAssetURL(currentSlideIndex, keyId, url) {
    let deckDataTemp = {}
    Object.assign(deckDataTemp,this.props.deckData);
    deckDataTemp.slides[currentSlideIndex].components[keyId].assetUrl = url;
    this.setState({deckData : deckDataTemp });
  }


  componentDidUpdate(prevProps, prevState){
    if(JSON.stringify(prevProps.deckData) != JSON.stringify(this.props.deckData)){
      const slides = this.getSlides();
      if(slides.length > 0){
        const {selectedSlide, currentSlideIndex, deckData} = this.state;
        if(selectedSlide && selectedSlide.slideId){
          const currentSelectedSlide = findWhere(slides, {slideId: selectedSlide.slideId});
          if(currentSelectedSlide){
            this.onSelectSlide(currentSelectedSlide);
          }else{
            const selectedKeyId = this.findExistedSlide(currentSlideIndex);
            if(selectedKeyId)
              this.onSelectSlide(slides[selectedKeyId]);
            else
              this.onSelectSlide(slides[0]);
          }
        }else{
          this.onSelectSlide(slides[0]);
        }
      }
    }
  }

  render(){
    return (
      <div className="deck-slides-component">
        <div className="slides-navigation">
          <div className="slides-header">
            <span className="title">SLIDES</span>
            <span className="add-slide" onClick={this.onAddSlide}>
              <i className="fa fa-plus-square"></i>
            </span>
          </div>
          <SortableList
            onSelectSlide={this.onSelectSlide}
            items={this.getSlides()}
            onSortEnd={this.onSortEnd}
            selectedSlide={this.state.selectedSlide}
          />

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
              <ContentView
                deckObject={this.props.deckObject}
                selectedSlide={this.state.selectedSlide}
                getSlides={this.getSlides}
                updateAssetURL={this.updateAssetURL}
              />
              : null
            }

            {this.state.mountDesignView?
              <DesignView
                viewState={this.state.viewState}
                currentSlideIndex={this.state.currentSlideIndex}
                deckObject={this.props.deckObject}
                deckData={this.state.deckData}
              /> : null
            }

          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(DeckSlides, {withRef: true});
