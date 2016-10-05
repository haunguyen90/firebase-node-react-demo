/**
 * Created by haunguyen on 9/15/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Thumbnail, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import {extend, findIndex} from 'underscore';
import {isMounted} from '~/lib/react/reactLib.js';
import { Circle } from 'rc-progress';
import {ENUMS} from '~/lib/_required/enums.js';
import Confirm from 'react-confirm-bootstrap';

import SlideComponent from './SlideComponent.js';
import UploadImageModal from './UploadImageModal.js';

class ImageComponent extends SlideComponent {
  constructor(props){
    super(props);

    let captionText = "";
    if(props.componentData && props.componentData.text)
      captionText = props.componentData.text;

    this.state = extend({
      text: captionText,
      showModal: false
    }, this.state);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
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

  showImageModal() {
    this.setState({ showModal : true});
  }

  closeShareWindow() {
    this.setState({ showModal : false});
  }

  render(){
    const {componentData, keyId} = this.props;
    const {text, isUploading, uploadPercent} = this.state;

    let imageURL = ENUMS.MISC.NO_IMAGE_AVAILABLE;
    if(componentData.assetId) {
      let assetRef = firebase.database().ref('userAssets/' + componentData.assetId);
      assetRef.on("value", (result) => {
        imageURL = result.val().url;
      });
    }

    return (
      <div className="slide-component image-component row">
        <Col sm={2}>
          <FormGroup controlId={"componentImagePic-" + keyId}>
            <ControlLabel>IMAGE</ControlLabel>
            {isUploading?
              <div className="circular-progress">
                <Circle percent={uploadPercent} strokeWidth="4" strokeColor="#D3D3D3" />
              </div> :
              <Thumbnail className="image-thumbnail" href="#" alt="171x180" src={imageURL} />
            }

            <div className="box__input">
              <Button className="uploadButton" bsStyle="primary" onClick={this.showImageModal.bind(this)} block>
                <label className="fileInputLabel">
                  <i className="fa fa-upload"></i>
                  <span className="label-text">UPLOAD</span>
                </label>
              </Button>
            </div>
          </FormGroup>
        </Col>

        <Col sm={10}>
          <FormGroup controlId={"componentImageText-" + keyId}>
            <Confirm
              onConfirm={this.onRemoveComponent}
              body="Are you sure you want to remove this component?"
              confirmText="Confirm Delete"
              title={"Deleting Component"}>
              <a href="#" className="remove-component">Remove</a>
            </Confirm>

            <FormControl
              componentClass="textarea"
              className="caption-area"
              placeholder="caption"
              value={text}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
            />
            <FormControl.Feedback />
          </FormGroup>
        </Col>
        <UploadImageModal
          showModal={this.state.showModal}
          closeShareWindow={this.closeShareWindow.bind(this)}
          {...this.props}
        />


      </div>
    )
  }
}

ImageComponent.propTypes = {
  handleAlertShow: React.PropTypes.func
};

export default withRouter(ImageComponent, {withRef: true});
