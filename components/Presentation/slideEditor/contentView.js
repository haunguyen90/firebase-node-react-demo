/**
 * Created by haunguyen on 9/15/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, Alert, PageHeader, Popover, OverlayTrigger, Row, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import {arrayMove} from 'react-sortable-hoc';
import {findIndex, extend, isArray, findWhere} from 'underscore';
import {ENUMS} from '~/lib/_required/enums.js';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Confirm from 'react-confirm-bootstrap';
import {isMounted} from '~/lib/react/reactLib.js';

import TitleComponent from './slideComponents/TitleComponent.js';
import ImageComponent from './slideComponents/ImageComponent.js';
import TextAreaComponent from './slideComponents/TextAreaComponent.js';
import BulletComponent from './slideComponents/BulletComponent.js';
import BarGraphComponent from './slideComponents/BarGraphComponent.js';

class ContentView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alertVisible: false,
      alertMessage: ""
    };
    this.renderSlideComponent = this.renderSlideComponent.bind(this);
    this.onDeleteSlide = this.onDeleteSlide.bind(this);
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    this.handleAlertShow = this.handleAlertShow.bind(this);
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

    const titleComponent = findWhere(components, (component) => {
      return component.type == ENUMS.SLIDE_COMPONENT.TYPES.TITLE;
    });

    let maxComponents = 3;

    if(titleComponent){
      maxComponents = 4;
      if(componentType == ENUMS.SLIDE_COMPONENT.TYPES.TITLE){
        this.handleAlertShow("Each slide can only have one title.");
        return;
      }
    }

    // Only add max 3 components
    if(components.length >= maxComponents){
      this.handleAlertShow("You can only add a maximum of 3 components to each slide");
      return;
    }

    let componentData = {
      fontSize: "12pt"
    };

    switch (componentType) {
      case ENUMS.SLIDE_COMPONENT.TYPES.TITLE:
        componentData = extend(componentData, {
          type: ENUMS.SLIDE_COMPONENT.TYPES.TITLE,
          text: ""
        });

        const existedComponent = findWhere(components, {type: ENUMS.SLIDE_COMPONENT.TYPES.TITLE});
        if(existedComponent){
          this.handleAlertShow("Title has been added already");
          return;
        }

        components.unshift(componentData);
        break;

      case ENUMS.SLIDE_COMPONENT.TYPES.TEXT:
        componentData = extend(componentData, {
          type: ENUMS.SLIDE_COMPONENT.TYPES.TEXT,
          text: ""
        });
        components.push(componentData);
        break;

      case ENUMS.SLIDE_COMPONENT.TYPES.IMAGE:
        componentData = extend(componentData, {
          type: ENUMS.SLIDE_COMPONENT.TYPES.IMAGE,
          text: "",
          image: ENUMS.MISC.NO_IMAGE_AVAILABLE
        });
        components.push(componentData);
        break;

      case ENUMS.SLIDE_COMPONENT.TYPES.BULLETS:
        componentData = extend(componentData, {
          type: ENUMS.SLIDE_COMPONENT.TYPES.BULLETS,
          text: ""
        });
        components.push(componentData);
        break;

      case ENUMS.SLIDE_COMPONENT.TYPES.BAR_GRAPH:
        componentData = extend(componentData, {
          type: ENUMS.SLIDE_COMPONENT.TYPES.BAR_GRAPH,
          xLabel: "",
          yLabel: "Revenue $M",
          xMax: 2,
          yMax: "240",
          groups: [
            {values: "", name: ""},
            {values: "", name: ""}
          ],
          sets: ["", "", ""],
          init: true
        });
        components.push(componentData);
        break;

      case ENUMS.SLIDE_COMPONENT.TYPES.PIE_GRAPH:
        componentData = extend(componentData, {
          type: ENUMS.SLIDE_COMPONENT.TYPES.PIE_GRAPH,
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
    const slides = this.props.getSlides();
    const currentSlideIndex = findIndex(slides, (slide) => {
      return slide.slideId == selectedSlide.slideId
    });

    if(currentSlideIndex >= 0){
      let deckDataRef = firebase.database().ref('deckData/' + deckId + '/slides/' + currentSlideIndex + '/components/');
      deckDataRef.set(components);
    }else{
      console.error("Could not find slide index when add component");
    }
  }

  onDeleteSlide(){
    const {selectedSlide, getSlides} = this.props;
    const slides = getSlides();
    if(slides && isArray(slides) && slides.length > 0){
      const currentSlideIndex = findIndex(slides, (slide) => {
        return slide.slideId == selectedSlide.slideId
      });

      if(currentSlideIndex >= 0){
        slides.splice(currentSlideIndex, 1);
        const deckId = this.props.deckObject.id;
        let deckDataRef = firebase.database().ref('deckData/' + deckId + '/slides/');
        deckDataRef.set(slides);
      }else{
        console.error("Could not find slide index when delete slide");
      }
    }

  }

  getAddComponentPopover(){
    return (
      <Popover id="popoverAddComponent" className="add-component-popover-container">
        <Row>
          <Col xs={4}>
            <a href="#" onClick={this.onAddComponent.bind(this, ENUMS.SLIDE_COMPONENT.TYPES.TITLE)} className="add-component-action add-title">Title</a>
          </Col>
          <Col xs={4}>
            <a href="#" onClick={this.onAddComponent.bind(this, ENUMS.SLIDE_COMPONENT.TYPES.TEXT)} className="add-component-action add-text">Text</a>
          </Col>
          <Col xs={4}>
            <a href="#" onClick={this.onAddComponent.bind(this, ENUMS.SLIDE_COMPONENT.TYPES.IMAGE)} className="add-component-action add-image">Image</a>
          </Col>
          <Col xs={4}>
            <a href="#" onClick={this.onAddComponent.bind(this, ENUMS.SLIDE_COMPONENT.TYPES.BULLETS)} className="add-component-action add-bullets">Bullets</a>
          </Col>
          <Col xs={4}>
            <a href="#" onClick={this.onAddComponent.bind(this, ENUMS.SLIDE_COMPONENT.TYPES.BAR_GRAPH)} className="add-component-action add-bar-graph">Bar Graph</a>
          </Col>
          <Col xs={4}>
            <a href="#" onClick={this.onAddComponent.bind(this, ENUMS.SLIDE_COMPONENT.TYPES.PIE_GRAPH)} className="add-component-action add-pie-graph">Pie Graph</a>
          </Col>
        </Row>
      </Popover>
    )
  }

  getSlideHeader(){
    const {selectedSlide, getSlides} = this.props;
    const slides = getSlides();
    const currentSlideIndex = findIndex(slides, (slide) => {
      return slide.slideId == selectedSlide.slideId
    });
    if(currentSlideIndex >= 0){
      return `Slide ${currentSlideIndex + 1}`;
    }else{
      return `Slide unknown`;
    }
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

  handleAlertDismiss(){
    this.setState({alertVisible: false});
    this.setState({alertMessage: ""});
  }

  handleAlertShow(message) {
    this.setState({alertVisible: true});
    this.setState({alertMessage: message});
    $(".main-slide-editor").animate({scrollTop: 0});
    setTimeout(() => {
      if(isMounted(this)){
        this.handleAlertDismiss();
      }
    }, 2000)
  }

  renderSlideComponent(component, index){
    const {selectedSlide} = this.props;

    switch (component.type) {
      case ENUMS.SLIDE_COMPONENT.TYPES.TITLE:
        return (
          <TitleComponent
            keyId={index} key={index}
            componentData={component}
            deckId={this.props.deckObject.id} selectedSlide={selectedSlide}
          />
        );
        break;

      case ENUMS.SLIDE_COMPONENT.TYPES.IMAGE:
        return (
          <ImageComponent
            keyId={index} key={index}
            componentData={component}
            deckId={this.props.deckObject.id}
            selectedSlide={selectedSlide}
            handleAlertShow={this.handleAlertShow}
          />
        );
        break;

      case ENUMS.SLIDE_COMPONENT.TYPES.TEXT:
        return (
          <TextAreaComponent
            keyId={index} key={index}
            componentData={component}
            deckId={this.props.deckObject.id} selectedSlide={selectedSlide}
          />
        );
        break;

      case ENUMS.SLIDE_COMPONENT.TYPES.BULLETS:
        return (
          <BulletComponent
            keyId={index} key={index}
            componentData={component}
            deckId={this.props.deckObject.id} selectedSlide={selectedSlide}
          />
        );
        break;

      case ENUMS.SLIDE_COMPONENT.TYPES.BAR_GRAPH:
        return (
          <BarGraphComponent
            keyId={index} key={index}
            componentData={component}
            deckId={this.props.deckObject.id} selectedSlide={selectedSlide}
          />
        );
        break;

      default :
        return null;
        break;
    }
  }

  render(){
    return (
      <div className="content-view-component">
        {this.state.alertVisible?
          <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss}>
            <p>{this.state.alertMessage}</p>
          </Alert> : null
        }

        <Panel header={this.getSlideHeader()} footer={this.getSlideFooter()}>
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