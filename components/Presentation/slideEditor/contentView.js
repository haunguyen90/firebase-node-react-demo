/**
 * Created by haunguyen on 9/15/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Popover, OverlayTrigger, Row, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import {arrayMove} from 'react-sortable-hoc';
import {findIndex, extend, isArray, findWhere} from 'underscore';
import {ENUMS} from '~/lib/_required/enums.js';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Confirm from 'react-confirm-bootstrap';

import TitleComponent from './TitleComponent.js';
import ImageComponent from './ImageComponent.js';
import TextAreaComponent from './TextAreaComponent.js'

class ContentView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderSlideComponent = this.renderSlideComponent.bind(this);
    this.onDeleteSlide = this.onDeleteSlide.bind(this);
  }

  getComponents(){
    const {selectedSlide} = this.props;
    if(selectedSlide.components && selectedSlide.components.length > 0){
      //const titleIndex = findIndex(selectedSlide.components, (component) => {
      //  return component.type == "TITLE";
      //});
      //return arrayMove(selectedSlide.components, titleIndex, 0);
      return selectedSlide.components;
    }
    return [];
  }

  onAddComponent(componentType, event){
    event.preventDefault();

    let components = [];
    const {selectedSlide} = this.props;

    if(selectedSlide.components && isArray(selectedSlide.components))
      components = selectedSlide.components;

    // Only add max 3 components
    if(components.length >= 3){
      alert("You can only add max 3 components");
      return;
    }

    let componentData = {
      fontSize: "12pt"
    };

    switch (componentType) {
      case "title":
        componentData = extend(componentData, {
          type: "TITLE",
          text: ""
        });

        const existedComponent = findWhere(components, {type: "TITLE"});
        if(existedComponent){
          alert("Title has been added already");
          return;
        }

        components.unshift(componentData);
        break;

      case "text":
        componentData = extend(componentData, {
          type: "TEXT",
          text: ""
        });
        components.push(componentData);
        break;

      case "image":
        componentData = extend(componentData, {
          type: "IMAGE",
          text: "",
          image: ENUMS.MISC.NO_IMAGE_AVAILABLE
        });
        components.push(componentData);
        break;

      case "barGraph":
        componentData = extend(componentData, {
          type: "BARGRAPH",
          text: "",
          image: ""
        });
        components.push(componentData);
        return false;
        break;

      case "pieGraph":
        componentData = extend(componentData, {
          type: "PIEGRAPH",
          text: "",
          image: ""
        });
        components.push(componentData);
        return false;
        break;

      default :
        console.error("Component type is invalid");
        return false;
        break;
    }

    // Update firebase database
    const deckId = this.props.deckObject.id;
    let deckDataRef = firebase.database().ref('deckData/' + deckId + '/slides/' + selectedSlide.keyId + '/components/');
    deckDataRef.set(components);
  }

  onDeleteSlide(){
    const {selectedSlide, getSlides} = this.props;
    const slides = getSlides();
    if(slides && isArray(slides) && slides.length > 0){
      slides.splice(selectedSlide.keyId, 1);

      const deckId = this.props.deckObject.id;
      let deckDataRef = firebase.database().ref('deckData/' + deckId + '/slides/');
      deckDataRef.set(slides);
    }

  }

  getAddComponentPopover(){
    return (
      <Popover id="popoverAddComponent" className="add-component-popover-container">
        <Row>
          <Col xs={4}>
            <a href="#" onClick={this.onAddComponent.bind(this, "title")} className="add-component-action add-title">Title</a>
          </Col>
          <Col xs={4}>
            <a href="#" onClick={this.onAddComponent.bind(this, "text")} className="add-component-action add-text">Text</a>
          </Col>
          <Col xs={4}>
            <a href="#" onClick={this.onAddComponent.bind(this, "image")} className="add-component-action add-image">Image</a>
          </Col>
          <Col xs={4}>
            <a href="#" onClick={this.onAddComponent.bind(this, "barGraph")} className="add-component-action add-bar-graph">Bar Graph</a>
          </Col>
          <Col xs={4}>
            <a href="#" onClick={this.onAddComponent.bind(this, "pieGraph")} className="add-component-action add-pie-graph">Pie Graph</a>
          </Col>
        </Row>
      </Popover>
    )
  }

  getSlideFooter(){
    return (
      <div className="slide-footer-config">
        <a href="#" className="duplicate-slide">Duplicate</a>
        <Confirm
          onConfirm={this.onDeleteSlide}
          body="Are you sure you want to delete this slide?"
          confirmText="Confirm Delete"
          title={"Deleting Slide " + this.props.selectedSlide.title}>
          <a href="#" className="delete-slide">Delete</a>
        </Confirm>


        <OverlayTrigger trigger="focus" placement="bottom" overlay={this.getAddComponentPopover()}>
          <a href="#" onClick={(e) => e.preventDefault()} className="show-add-components-popover">Add Component</a>
        </OverlayTrigger>
      </div>
    )
  }

  renderSlideComponent(component, index){
    const {selectedSlide} = this.props;

    if(component.type == "TITLE")
      return (<TitleComponent keyId={index} key={index} componentData={component} deckId={this.props.deckObject.id} selectedSlide={selectedSlide}/>);
    else if(component.type == "IMAGE")
      return (<ImageComponent keyId={index} key={index} componentData={component} deckId={this.props.deckObject.id} selectedSlide={selectedSlide}/>);
    else if(component.type == "TEXT")
      return (<TextAreaComponent keyId={index} key={index} componentData={component} deckId={this.props.deckObject.id} selectedSlide={selectedSlide}/>);
    else
      return null;
  }

  render(){
    return (
      <div className="content-view-component">
        <Panel header={this.props.selectedSlide.title} footer={this.getSlideFooter()}>
          <div className="slide-detail">
            <ReactCSSTransitionGroup
              transitionName="slide-animation"
              transitionEnterTimeout={500}
              transitionAppear={true}
              transitionAppearTimeout={500}
              transitionLeaveTimeout={300}
              >
              {this.getComponents().length > 0?
                this.getComponents().map(this.renderSlideComponent) :
                <div className="empty-slide">
                  There are no components on this slide. Let’s add some to make it
                  useful.
                </div>
              }
            </ReactCSSTransitionGroup>

          </div>
        </Panel>
      </div>
    )
  }
}

ContentView.propTypes = {
  deckObject: React.PropTypes.object,
  selectedSlide: React.PropTypes.object,
  getSlides: React.PropTypes.func
};

export default withRouter(ContentView, {withRef: true});