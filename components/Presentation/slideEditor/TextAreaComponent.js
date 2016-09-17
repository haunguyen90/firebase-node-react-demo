/**
 * Created by haunguyen on 9/15/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Thumbnail, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import {extend} from 'underscore';

import SlideComponent from './SlideComponent.js';

class TextAreaComponent extends SlideComponent {
  constructor(props){
    super(props);

    let textArea = "";
    if(props.componentData && props.componentData.text)
      textArea = props.componentData.text;

    this.state = extend({
      text: textArea
    }, this.state);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.onRemoveComponent = this.onRemoveComponent.bind(this);
  }

  handleChange(event){
    event.preventDefault();
    const value = event.target.value;
    this.setState({text: value});
  }

  componentDidUpdate(prevProps, prevState){
    if(JSON.stringify(prevProps.componentData) && JSON.stringify(this.props.componentData)){
      if(this.props.componentData.text != prevProps.componentData.text)
        this.setState({text: this.props.componentData.text});
    }
  }

  render(){
    const {componentData, keyId} = this.props;
    const {text} = this.state;

    return (
      <div className="slide-component textarea-component row">
        <Col sm={12}>
          <FormGroup controlId={"componentTextArea-" + keyId}>
            <ControlLabel>TEXT</ControlLabel>
            <a href="#" className="remove-component" onClick={this.onRemoveComponent}>Remove</a>
            <FormControl
              componentClass="textarea"
              className="textarea-text"
              placeholder="Description"
              value={text}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              />
            <FormControl.Feedback />
          </FormGroup>
        </Col>
      </div>
    )
  }
}

TextAreaComponent.propTypes = {
  keyId: React.PropTypes.number,
  componentData: React.PropTypes.object,
  deckId: React.PropTypes.string,
  selectedSlide: React.PropTypes.object
};

export default withRouter(TextAreaComponent, {withRef: true});