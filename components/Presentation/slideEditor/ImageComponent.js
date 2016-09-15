/**
 * Created by haunguyen on 9/15/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Thumbnail, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import {extend} from 'underscore';

import SlideComponent from './SlideComponent.js';

class ImageComponent extends SlideComponent {
  constructor(props){
    super(props);

    let captionText = "";
    if(props.componentData && props.componentData.text)
      captionText = props.componentData.text;

    this.state = extend({
      captionText: captionText
    }, this.state);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleChange(event){
    event.preventDefault();
    const value = event.target.value;
    this.setState({captionText: value});
  }

  handleBlur(event){
    event.preventDefault();

  }

  componentDidUpdate(prevProps, prevState){
    if(JSON.stringify(prevProps.componentData) && JSON.stringify(this.props.componentData)){
      if(this.props.componentData.text != prevProps.componentData.text)
        this.setState({captionText: this.props.componentData.text});
    }
  }

  render(){
    const {componentData, keyId} = this.props;
    const {captionText} = this.state;

    return (
      <div className="slide-component image-component row">
        <Col sm={2}>
          <FormGroup controlId={"componentImagePic-" + keyId}>
            <ControlLabel>IMAGE</ControlLabel>
            <Thumbnail className="image-thumbnail" href="#" alt="171x180" src="/images/avatar_default.jpg" />
            <Button bsStyle="primary" block>UPLOAD</Button>
          </FormGroup>
        </Col>

        <Col sm={10}>
          <FormGroup controlId={"componentImageText-" + keyId}>
            <a href="#" className="remove-component">Remove</a>
            <FormControl
              componentClass="textarea"
              className="caption-area"
              placeholder="caption"
              value={captionText}
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

ImageComponent.propTypes = {
  keyId: React.PropTypes.number,
  componentData: React.PropTypes.object
};

export default withRouter(ImageComponent, {withRef: true});