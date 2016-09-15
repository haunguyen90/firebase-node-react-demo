/**
 * Created by haunguyen on 9/15/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import {arrayMove} from 'react-sortable-hoc';
import {findIndex} from 'underscore';

import TitleComponent from './TitleComponent.js';
import ImageComponent from './ImageComponent.js';
import TextAreaComponent from './TextAreaComponent.js'

class ContentView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getComponents(){
    const {selectedSlide} = this.props;
    if(selectedSlide.components && selectedSlide.components.length > 0){
      const titleIndex = findIndex(selectedSlide.components, (component) => {
        return component.type == "TITLE";
      });
      return arrayMove(selectedSlide.components, titleIndex, 0);
    }
    return [];
  }

  renderSlideComponent(component, index){
    if(component.type == "TITLE")
      return (<TitleComponent keyId={index} key={index} componentData={component}/>);
    else if(component.type == "IMAGE")
      return (<ImageComponent keyId={index} key={index} componentData={component}/>);
    else if(component.type == "TEXT")
      return (<TextAreaComponent keyId={index} key={index} componentData={component}/>);
    else
      return null;
  }

  render(){
    return (
      <div className="content-view-component">
        <Panel header={this.props.selectedSlide.title} footer="Panel footer">
          <div className="slide-detail">
            {this.getComponents().map(this.renderSlideComponent)}
          </div>
        </Panel>
      </div>
    )
  }
}

export default withRouter(ContentView, {withRef: true});