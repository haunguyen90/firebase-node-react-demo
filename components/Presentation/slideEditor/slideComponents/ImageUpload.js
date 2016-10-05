import React from 'react';
import {Row, Button, Col} from 'react-bootstrap';
import {isMounted} from '~/lib/react/reactLib.js';
import {findIndex} from 'underscore';
import { Circle } from 'rc-progress';

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUploading: false,
      uploadPercent: 0
    }
  }

  // Check the browser support drag n drop
  checkDragNDropFeature() {
      var div = document.createElement('div');
      return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
  }

  // If the browser doesn't support drag n drop don't show the message to guide the user.
  renderUploadText() {
    if (this.checkDragNDropFeature()) {
      return (
        <span className="box__dragndrop">Drop file here to Upload OR </span>
      );
    }
  }

  updatePhotoURLToDB(downloadURL){
    const {selectedSlide, keyId, deckId, getSlides} = this.props;

    // Upload image completed. Save data to UserAsset and Open LIBRARY tab
    this.props.handleUploadImageTabSelect(2);
    let newUserAssetKey = firebase.database().ref().child('userAssets').push().key;
    firebase.database().ref('userAssets/' + newUserAssetKey).set({
      uid: firebase.auth().currentUser.uid,
      type: "IMAGE",
      url : downloadURL
    });
    
  }

  onInputFileChange(evt){
    evt.stopPropagation();
    evt.preventDefault();

    const pattern = /^image\/(gif|jpg|jpeg|tiff|png)$/i;

    const storageRef = firebase.storage().ref();
    const file = evt.target.files[0];

    if(!pattern.test(file.type)){
      this.props.handleAlertShow("File type not support");
      return false;
    }

    const metadata = {
      'contentType': file.type
    };

    // Upload file and metadata to the object, each user has its folder to store image
    if (firebase.auth().currentUser) {
      const uploadTask = storageRef.child('images/' + firebase.auth().currentUser.uid + '/' +file.name).put(file, metadata);
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
          if (firebase.storage.TaskState.SUCCESS) {

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
        })
    } else {
      //TODO: return failed if user is not login
      console.log('No user is login');
    }
  }


  render() {
    const {isUploading, uploadPercent} = this.state;
    return (
      <Row className="imageupload-component">
        <Col xs={12}>
          <form className="box" method="post" action="" encType="multipart/form-data">
            <div className="box__input">
              <input className="box__file" onChange={this.onInputFileChange.bind(this)} type="file" name="file" id="fileInput" accept='image/*'/>
              <p>{this.renderUploadText()}</p>

              {isUploading?
                <div className="circular-progress">
                  <Circle percent={uploadPercent} strokeWidth="4" strokeColor="#D3D3D3" />
                </div> : null
              }

              <Button className="uploadButton" bsStyle="default">
                <label htmlFor="fileInput" className="fileInputLabel">
                  <span className="label-text">SELECT FILE</span>
                </label>
              </Button>
            </div>
            <div className="box__uploading">Uploading&hellip;</div>
            <div className="box__success">Done!</div>
            <div className="box__error">Error! <span></span>.</div>
          </form>
        </Col>
      </Row>
    )
  }
}

ImageUpload.propTypes = {
  selectedSlide : React.PropTypes.object,
  keyId : React.PropTypes.number,
  deckId : React.PropTypes.string,
  getSlides : React.PropTypes.func,
  closeShareWindow : React.PropTypes.func,
  handleUploadImageTabSelect : React.PropTypes.func
};

export default ImageUpload;
