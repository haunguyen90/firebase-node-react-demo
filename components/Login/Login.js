/**
 * Created by haunguyen on 9/2/16.
 */
import React from 'react';
import {Link} from 'react-router';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUid: null
    };
  }

  handleSignedInUser(user){
    this.setState({currentUid: user.uid});
    document.getElementById('user-signed-in').style.display = 'block';
    document.getElementById('user-signed-out').style.display = 'none';
    document.getElementById('name').textContent = user.displayName;
    document.getElementById('email').textContent = user.email;
    if (user.photoURL){
      document.getElementById('photo').src = user.photoURL;
      document.getElementById('photo').style.display = 'block';
    } else {
      document.getElementById('photo').style.display = 'none';
    }
  }

  handleSignedOutUser(){
    document.getElementById('user-signed-in').style.display = 'none';
    document.getElementById('user-signed-out').style.display = 'block';
    this.props.ui.start('#firebaseui-container', this.props.uiConfig);
  }

  onSignOut(e){
    e.preventDefault();
    firebase.auth().signOut();
  }

  toggleSignIn(){
    if (firebase.auth().currentUser) {
      // [START signout]
      firebase.auth().signOut();
      // [END signout]
    } else {
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Sign in with email and pass.
      // [START authwithemail]
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
        document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
      });
      // [END authwithemail]
    }
    document.getElementById('quickstart-sign-in').disabled = true;
  }

  handleSignUp(){
    console.log("here");
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
    // [END createwithemail]
  }

  sendEmailVerification(){
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function() {
      // Email Verification sent!
      // [START_EXCLUDE]
      alert('Email Verification Sent!');
      // [END_EXCLUDE]
    });
    // [END sendemailverification]
  }

  sendPasswordReset(){
    var email = document.getElementById('email').value;
    // [START sendpasswordemail]
    firebase.auth().sendPasswordResetEmail(email).then(function() {
      // Password Reset Email Sent!
      // [START_EXCLUDE]
      alert('Password Reset Email Sent!');
      // [END_EXCLUDE]
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/invalid-email') {
        alert(errorMessage);
      } else if (errorCode == 'auth/user-not-found') {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
  }

  componentDidMount(){
    this.props.ui = new firebaseui.auth.AuthUI(firebase.auth());

    firebase.auth().onAuthStateChanged((user) => {
      // The observer is also triggered when the user's token has expired and is
      // automatically refreshed. In that case, the user hasn't changed so we should
      // not update the UI.
      if (user && user.uid == this.state.currentUid) {
        return;
      }
      if(user){
        this.setState({currentUid: user.uid});
      }else{
        this.setState({currentUid: null});
      }
      
      document.getElementById('loading').style.display = 'none';
      document.getElementById('loaded').style.display = 'block';
      if(user)
        this.handleSignedInUser(user);
      else
        this.handleSignedOutUser();
    });



    // Listening for auth state changes.
    // [START authstatelistener]
    //firebase.auth().onAuthStateChanged(function(user) {
    //  // [START_EXCLUDE silent]
    //  document.getElementById('quickstart-verify-email').disabled = true;
    //  // [END_EXCLUDE]
    //  if (user) {
    //    // User is signed in.
    //    var displayName = user.displayName;
    //    var email = user.email;
    //    var emailVerified = user.emailVerified;
    //    var photoURL = user.photoURL;
    //    var isAnonymous = user.isAnonymous;
    //    var uid = user.uid;
    //    var providerData = user.providerData;
    //    // [START_EXCLUDE silent]
    //    document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
    //    document.getElementById('quickstart-sign-in').textContent = 'Sign out';
    //    document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
    //    if (!emailVerified) {
    //      document.getElementById('quickstart-verify-email').disabled = false;
    //    }
    //    // [END_EXCLUDE]
    //  } else {
    //    // User is signed out.
    //    // [START_EXCLUDE silent]
    //    document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
    //    document.getElementById('quickstart-sign-in').textContent = 'Sign in';
    //    document.getElementById('quickstart-account-details').textContent = 'null';
    //    // [END_EXCLUDE]
    //  }
    //  // [START_EXCLUDE silent]
    //  document.getElementById('quickstart-sign-in').disabled = false;
    //  // [END_EXCLUDE]
    //});
    // [END authstatelistener]
  }
  
  render(){
    return (
      <div className="login-page">
        <div id="loading">Loading...</div>
        <div id="loaded" className="">
          <div id="main">
            <div id="user-signed-in" ref="userSignedIn" className="">
              <div id="user-info">
                <div id="photo-container">
                  <img id="photo"></img>
                </div>
                <div id="name"></div>
                <div id="email"></div>
                <div className="clearfix"></div>
              </div>
              <p>
                <button id="sign-out" onClick={this.onSignOut}>Sign Out</button>
                <button id="delete-account">Delete account</button>
              </p>
            </div>
            <div id="user-signed-out" className="">
              <h4>You are signed out.</h4>
              <div id="firebaseui-spa">
                <h5>Login With:</h5>
                <div id="firebaseui-container"></div>
              </div>

              {this.state.currentUid?
                null :
                <div className="sign-up-link">
                  <h5>Or :</h5>
                  <button className="firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised firebaseui-idp-password firebaseui-id-idp-button">
                    Sign-up with Email
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login;