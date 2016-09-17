/**
 * Created by haunguyen on 9/15/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Thumbnail, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import {extend} from 'underscore';
import {isMounted} from '~/lib/react/reactLib.js';
import { Circle } from 'rc-progress';
import {ENUMS} from '~/lib/_required/enums.js';
import Confirm from 'react-confirm-bootstrap';

import SlideComponent from './SlideComponent.js';

class ImageComponent extends SlideComponent {
  constructor(props){
    super(props);

    let captionText = "";
    if(props.componentData && props.componentData.text)
      captionText = props.componentData.text;

    this.state = extend({
      text: captionText,
      isUploading: false,
      uploadPercent: 0
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

  updatePhotoURLToDB(downloadURL){
    const {selectedSlide, keyId, deckId} = this.props;

    if(selectedSlide.components && selectedSlide.components[keyId]){
      let component = selectedSlide.components[keyId];
      component.image = downloadURL;

      let deckDataRef = firebase.database().ref('deckData/' + deckId + '/slides/' + selectedSlide.keyId + '/components/' + keyId);
      deckDataRef.set(component);
    }
  }

  onInputFileChange(evt){
    evt.stopPropagation();
    evt.preventDefault();

    const storageRef = firebase.storage().ref();
    const file = evt.target.files[0];

    const metadata = {
      'contentType': file.type
    };

    // Upload file and metadata to the object
    const uploadTask = storageRef.child('images/' + file.name).put(file, metadata);

    const instance = this;
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if(isMounted(instance)){
          this.setState({isUploading: true});
          this.setState({uploadPercent: progress});
        }
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, (error) => {
        switch (error.code) {
          case 'storage/unauthorized':
            console.error(error);
            // User doesn't have permission to access the object
            break;

          case 'storage/canceled':
            console.error(error);
            // User canceled the upload
            break;

          case 'storage/unknown':
            console.error(error);
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      }, () => {
        // Upload completed successfully, now we can get the download URL
        const downloadURL = uploadTask.snapshot.downloadURL;
        setTimeout(() =>{
          if(isMounted(instance)){
            this.setState({isUploading: false});
            this.setState({uploadPercent: 0});
            this.updatePhotoURLToDB(downloadURL);
          }
        }, 175);
      });
  }

  render(){
    const {componentData, keyId} = this.props;
    const {text, isUploading, uploadPercent} = this.state;

    let imageURL = ENUMS.MISC.NO_IMAGE_AVAILABLE;
    if(componentData.image)
      imageURL = componentData.image;

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
              <input className="box__file" onChange={this.onInputFileChange.bind(this)} type="file" name="file" id="fileInput" />
              <Button className="uploadButton" bsStyle="primary" block>

                <label htmlFor="fileInput" className="fileInputLabel">
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
      </div>
    )
  }
}

ImageComponent.propTypes = {
  keyId: React.PropTypes.number,
  componentData: React.PropTypes.object,
  deckId: React.PropTypes.string,
  selectedSlide: React.PropTypes.object
};

export default withRouter(ImageComponent, {withRef: true});