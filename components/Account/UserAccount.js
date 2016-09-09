/**
 * Created by haunguyen on 9/9/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {PageHeader, FormGroup, ControlLabel, FormControl, HelpBlock, Alert, Image} from 'react-bootstrap';

import AvatarEditor from "react-avatar-editor";

import UpdatePictureModal from './UpdatePictureModal.js';

class UserAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
      borderRadius: 0,
      preview: null,
      img: "/images/avatar_default.jpg",
      showModal: false
    };
  }

  handleSave(data) {
    const img = this.refs.avatar.getImage().toDataURL();
    const rect = this.refs.avatar.getCroppingRect();
    this.setState({preview: img, croppingRect: rect});
  }

  openUpdatePictureModal(e){
    e.preventDefault();
    this.setState({showModal: true});
  }

  closeUpdatePictureModal(){
    this.setState({showModal: false});
  }

  render(){
    return (
      <div className="user-account-component container">
        <PageHeader>PROFILE</PageHeader>
        <Alert bsStyle="warning">
          Your changes have been saved.
        </Alert>
        <Image width={50} height={50} src="/images/avatar_default.jpg" circle />
        <span><a href="#" onClick={this.openUpdatePictureModal.bind(this)}>Update Profile Picture</a></span>
        <form>
          <FormGroup>
            <ControlLabel>Avatar</ControlLabel>
          </FormGroup>


        </form>
        <UpdatePictureModal
          showModal={this.state.showModal}
          onCloseModal={this.closeUpdatePictureModal.bind(this)}
        />
      </div>
    )
  }
}

export default withRouter(UserAccount);
