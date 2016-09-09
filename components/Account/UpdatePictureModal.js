/**
 * Created by haunguyen on 9/10/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Alert, Image, Modal, Button, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import $ from "jquery";

import AvatarEditor from "react-avatar-editor";

class EditAvatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
      preview: null,
      img: "/images/drag-drop.gif"
    };
  }

  handleScale() {
    const scale = parseFloat(this.refs.scale.value);
    this.setState({scale: scale});
  }

  handleSave(data) {
    const img = this.refs.avatar.getImage().toDataURL();

    // Store profile picture to google cloud storage
    const storageRef = firebase.storage().ref();

    const fileName = `profile-picture-${firebase.auth().currentUser.uid}.jpg`;
    const message = img.split(",")[1];;
    storageRef.child('images/' + fileName).putString(message, "base64").then((snapshot) => {
      const url = snapshot.metadata.downloadURLs[0];
      this.updatePicUrlInDatabase(url);

    }).catch((error) => {
      // [START onfailure]
      console.error('Upload failed:', error);
      // [END onfailure]
    });

  }

  updatePicUrlInDatabase(url){

    const Database = firebase.database();

    let updates = {};
    updates['/users/' + firebase.auth().currentUser.uid + '/picUrl/'] = url;
    Database.ref().update(updates);
  }

  logCallback(e) {
    console.log("callback", e);
  }

  render(){
    return (
      <div className="edit-avatar-component">
        <AvatarEditor
          ref="avatar"
          image={this.props.image}
          scale={this.state.scale}
          borderRadius={200}
          onSave={this.handleSave.bind(this)}
          onLoadSuccess={this.logCallback.bind(this, 'success loaed')}
          onLoadFailure={this.logCallback.bind(this, 'onLoadFailed')}
          onDropFile={this.logCallback.bind(this, 'onUpload')}
          onImageReady={this.logCallback.bind(this, 'onImageLoad')}
          width={400}
          height={400}
        />

        <br />
        <div className="scale-range-input-wrapper">
          <input name="scale" type="range" ref="scale" onChange={this.handleScale.bind(this)} min="1" max="3" step="0.01" defaultValue="1" />
        </div>
        <br />
        <br />
        <input type="button" onClick={this.handleSave.bind(this)} value="Upload" />
        <br />
        <img src={this.state.preview} style={{borderRadius: this.state.borderRadius + 5 /* because of the 5px padding */}}/>
      </div>
    )
  }
}

EditAvatar.propTypes = {
  image: React.PropTypes.string
};

class UpdatePictureModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
      borderRadius: 0,
      preview: null,
      img: "/images/avatar_default.jpg",
      fileUploadDataURL: null,
      showAvatarEditor: false
    };
  }

  isAdvancedUpload() {
    const div = document.createElement('div');
    return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
  };

  onInitDragDrop(){
    if (this.isAdvancedUpload()) {

      let droppedFiles = false;
      const $form = $(this.refs.uploadForm);
      $form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
      })
        .on('dragover dragenter', function() {
          $form.addClass('is-dragover');
        })
        .on('dragleave dragend drop', function() {
          $form.removeClass('is-dragover');
        })
        .on('drop', function(e) {
          //droppedFiles = e.originalEvent.dataTransfer.files;
          this.readURL(e.originalEvent.dataTransfer);
        });

    }
  }

  onInputFileChange(e){
    e.preventDefault();
    this.readURL(e.target);
  }

  readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = (e) => {
        this.setState({fileUploadDataURL: e.target.result});
        this.setState({showAvatarEditor: true});
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  render(){
    let formClass = "box";
    if(this.isAdvancedUpload())
      formClass+= " has-advanced-upload";
    return (
      <Modal show={this.props.showModal} onHide={this.props.onCloseModal} onEntered={this.onInitDragDrop.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.showAvatarEditor?
            <EditAvatar
              image={this.state.fileUploadDataURL}
            /> :
            <form ref="uploadForm" className={formClass}>
              <div className="box__input">
                <input className="box__file" onChange={this.onInputFileChange.bind(this)} type="file" name="files[]" id="file" data-multiple-caption="{count} files selected" multiple />
                <label htmlFor="file"><strong className="box__choose-file">Choose a file</strong><span className="box__dragndrop"> or drag it here</span>.</label>
              </div>
              <div className="box__uploading">Uploading&hellip;</div>
              <div className="box__success">Done!</div>
              <div className="box__error">Error! <span></span>.</div>
            </form>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.close}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

UpdatePictureModal.propTypes = {
  showModal: React.PropTypes.bool,
  onCloseModal: React.PropTypes.func
};

export default UpdatePictureModal;