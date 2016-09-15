/**
 * Created by haunguyen on 9/15/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import {extend} from 'underscore';

import SlideComponent from './SlideComponent.js';

class TitleComponent extends SlideComponent {
  constructor(props) {
    super(props);
    let titleText = "";
    if(props.componentData && props.componentData.text)
      titleText = props.componentData.text;
    this.state = extend({
      titleText: titleText
    }, this.state);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleChange(event){
    event.preventDefault();
    const value = event.target.value;
    this.setState({titleText: value});
  }

  handleBlur(event){
    event.preventDefault();

  }

  componentDidMount(){

  }

  componentDidUpdate(prevProps, prevState){
    if(JSON.stringify(prevProps.componentData) && JSON.stringify(this.props.componentData)){
      if(this.props.componentData.text != prevProps.componentData.text)
        this.setState({titleText: this.props.componentData.text});
    }
  }

  render(){
    const {componentData, keyId} = this.props;
    const {titleText} = this.state;
    return (
      <div className="slide-component title-component row">
        <Col sm={12}>
          <FormGroup controlId={"componentTitleText-" + keyId}>
            <ControlLabel>TITLE</ControlLabel>
            <a href="#" className="remove-component">Remove</a>
            <FormControl
              type="text"
              value={titleText}
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
  componentData: React.PropTypes.object
};

export default withRouter(TitleComponent, {withRef: true});