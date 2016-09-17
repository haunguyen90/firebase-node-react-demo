/**
 * Created by haunguyen on 9/15/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import {extend, findIndex} from 'underscore';
import Confirm from 'react-confirm-bootstrap';

import SlideComponent from './SlideComponent.js';

class TitleComponent extends SlideComponent {
  constructor(props) {
    super(props);
    let titleText = "";
    if(props.componentData && props.componentData.text)
      titleText = props.componentData.text;
    this.state = extend({
      text: titleText
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

  componentDidMount(){

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
      <div className="slide-component title-component row">
        <Col sm={12}>
          <FormGroup controlId={"componentTitleText-" + keyId}>
            <ControlLabel>TITLE</ControlLabel>
            <Confirm
              onConfirm={this.onRemoveComponent}
              body="Are you sure you want to remove this component?"
              confirmText="Confirm Delete"
              title={"Deleting Component"}>
              <a href="#" className="remove-component">Remove</a>
            </Confirm>

            <FormControl
              type="text"
              value={text}
              placeholder="Enter slide title"
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

TitleComponent.propTypes = {
  keyId: React.PropTypes.number,
  componentData: React.PropTypes.object,
  deckId: React.PropTypes.string,
  selectedSlide: React.PropTypes.object
};

export default withRouter(TitleComponent, {withRef: true});