/**
 * Created by haunguyen on 9/9/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {PageHeader, FormGroup, ControlLabel, FormControl, HelpBlock, Alert, Image, Button} from 'react-bootstrap';
import {ENUMS} from '~/lib/_required/enums.js';

import AvatarEditor from "react-avatar-editor";

import UpdatePictureModal from './UpdatePictureModal.js';

class UserAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
      borderRadius: 0,
      preview: null,
      img: ENUMS.MISC.AVATAR_DEFAULT,
      showModal: false,
      ACCOUNT_ERROR: null,
      userObject: {},
      userUpdate: {
        name: "",
        bio: ""
      },
      isLoading: false,
      currentUserId: null,
      observerAuth: null
    };
  }

  openUpdatePictureModal(e){
    e.preventDefault();
    this.setState({showModal: true});
  }

  closeUpdatePictureModal(){
    this.setState({showModal: false});
  }

  showError(){
    if(this.state.ACCOUNT_ERROR){
      return this.state.ACCOUNT_ERROR.message;
    }
  }

  showErrorState(){
    if(this.state.ACCOUNT_ERROR){
      if(this.state.ACCOUNT_ERROR == "success"){
        return "success";
      }else if(this.state.ACCOUNT_ERROR == "error"){
        return "error";
      }else if(this.state.ACCOUNT_ERROR == "warning"){
        return "warning";
      }
    }
  }

  setError(error){
    this.setState({ACCOUNT_ERROR: error});
  }

  componentDidMount(){
    const observerAuth = firebase.auth().onAuthStateChanged((user) => {
      if(user){
        let userRef = firebase.database().ref('users/' + user.uid);
        userRef.on("value", (result) => {
          this.setState({userObject: result.val()});
          this.setState({userUpdate: {
            name: result.val().name,
            bio: result.val().bio || ""
          }});
          this.setState({currentUserId: user.uid});
        });
      }else{
        const userId = this.state.currentUserId;
        if(userId){
          let userRef = firebase.database().ref('users/' + user.uid);
          userRef.off();
        }
      }
    });
    this.setState({observerAuth: observerAuth});
  }

  componentWillUnmount(){
    const observerAuth = this.state.observerAuth;
    if(observerAuth && typeof observerAuth == 'function'){
      // Unsubscribe auth change
      observerAuth();
    }
  }

  getProfilePicture() {
    const {userObject} = this.state;
    if(userObject.picUrl)
      return userObject.picUrl;
    else
      return ENUMS.MISC.AVATAR_DEFAULT;
  }

  getValidationState(){
    const {userUpdate} = this.state;
    if(userUpdate)
    if(userUpdate.name){
      if(userUpdate.name.length <= 0){
        return "error";
      }
    }else{
      return "error";
    }
  }

  getUserInfo(field){
    const {userUpdate} = this.state;
    if(userUpdate && userUpdate[field])
      return userUpdate[field];
  }

  handleChange(field, event){
    event.preventDefault();
    const {userUpdate} = this.state;
    if(userUpdate && field in userUpdate){
      const value = event.target.value;
      userUpdate[field] = value;
      this.setState({ userUpdate: userUpdate });
    }

  }

  handleFormSubmit(event){
    event.preventDefault();
    this.setState({isLoading: true});
    this.setError(null);
    const {userUpdate} = this.state;
    const Database = firebase.database();

    let newUserUpdate = {
      name: userUpdate.name.trim(),
      bio: userUpdate.bio.trim()
    };
    if(!newUserUpdate.name || newUserUpdate.name == ""){
      this.setState({isLoading: false});
      return false;
    }

    let updates = {};
    updates['/users/' + firebase.auth().currentUser.uid + '/name'] = newUserUpdate.name;
    updates['/users/' + firebase.auth().currentUser.uid + '/bio'] = newUserUpdate.bio;
    Database.ref().update(updates);
    this.setState({isLoading: false});
    this.setError({
      error: "success",
      message: "Your changes have been saved."
    })
  }

  render(){
    return (
      <div className="user-account-component container">
        <PageHeader>PROFILE</PageHeader>
        {this.showError()?
          <Alert bsStyle={this.showErrorState()}>
            {this.showError()}
          </Alert> : null
        }

        <Image width={50} height={50} src={this.getProfilePicture()} circle />
        <span className="upload-link"><a href="#" onClick={this.openUpdatePictureModal.bind(this)}>Update Profile Picture</a></span>
        <form className="updateUserInfoFrm" onSubmit={this.handleFormSubmit.bind(this)}>
          <FormGroup
            controlId="userFullName"
            validationState={this.getValidationState()}
          >
            <ControlLabel>Your Name</ControlLabel>
            <FormControl
              type="text"
              value={this.getUserInfo('name')}
              onChange={this.handleChange.bind(this, 'name')}
              placeholder="Your name"
              name="userFullName"
            />
            <FormControl.Feedback />
            <HelpBlock>Full name is required</HelpBlock>
          </FormGroup>

          <FormGroup controlId="userBio">
            <ControlLabel>Bio</ControlLabel>
            <FormControl componentClass="textarea" value={this.getUserInfo('bio')} onChange={this.handleChange.bind(this, 'bio')} placeholder="Bio" name="userBio"/>
          </FormGroup>

          <Button
            bsStyle="primary"
            type="submit"
            disabled={this.state.isLoading}
          >
            {this.state.isLoading ? 'Updating....' : 'Save changes'}
          </Button>
        </form>
        <UpdatePictureModal
          showModal={this.state.showModal}
          onCloseModal={this.closeUpdatePictureModal.bind(this)}
          setError={this.setError.bind(this)}
        />
      </div>
    )
  }
}

export default withRouter(UserAccount);
