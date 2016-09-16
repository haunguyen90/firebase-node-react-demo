/**
 * Created by haunguyen on 9/15/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Popover, OverlayTrigger, Row, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import {arrayMove} from 'react-sortable-hoc';
import {findIndex} from 'underscore';

import TitleComponent from './TitleComponent.js';
import ImageComponent from './ImageComponent.js';
import TextAreaComponent from './TextAreaComponent.js'

class ContentView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderSlideComponent = this.renderSlideComponent.bind(this);
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

  getAddComponentPopover(){
    return (
      <Popover id="popoverAddComponent" className="add-component-popover-container">
        <Row>
          <Col xs={4}>
            <a href="#" className="add-component-action add-title">Title</a>
          </Col>
          <Col xs={4}>
            <a href="#" className="add-component-action add-text">Text</a>
          </Col>
          <Col xs={4}>
            <a href="#" className="add-component-action add-image">Image</a>
          </Col>
          <Col xs={4}>
            <a href="#" className="add-component-action add-bar-graph">Bar Graph</a>
          </Col>
          <Col xs={4}>
            <a href="#" className="add-component-action add-pie-graph">Pie Graph</a>
          </Col>
        </Row>
      </Popover>
    )
  }

  getSlideFooter(){
    return (
      <div className="slide-footer-config">
        <a href="#" className="duplicate-slide">Duplicate</a>
        <a href="#" className="delete-slide">Delete</a>
        <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={this.getAddComponentPopover()}>
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
            {this.getComponents().map(this.renderSlideComponent)}
          </div>
        </Panel>
      </div>
    )
  }
}

ContentView.propTypes = {
  deckObject: React.PropTypes.object,
  selectedSlide: React.PropTypes.object
};

export default withRouter(ContentView, {withRef: true});