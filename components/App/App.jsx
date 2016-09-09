import React from 'react';
import AppNavbar from '../Navbar/Navbar.js';
import Footer from '../Footer/Footer.js';
import firebase from "firebase";
import { browserHistory } from 'react-router';
import { withRouter } from 'react-router';

import {Grid, Row, Col} from 'react-bootstrap';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUid: null
    };
  }

  componentWillMount(){

  }

  convertImgToBase64URL(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
      var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'), dataURL;
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      callback(dataURL);
      canvas = null;
    };
    img.src = url;
  }

  updateProfilePicture(){
    firebase.database().ref('users').once('value').then((result) => {
      let user = firebase.auth().currentUser;
      let users = result.val();
      if(!users) users = {};
      if(users[user.uid] && !users[user.uid].picUrl && users[user.uid].socialImgUrl){
        this.convertImgToBase64URL(users[user.uid].socialImgUrl, this.storeFileToCloud.bind(this));
      }
    });
  }

  storeFileToCloud(base64Img){
    // Store profile picture to google cloud storage
    const storageRef = firebase.storage().ref();

    const fileName = `profile-picture-${firebase.auth().currentUser.uid}.jpg`;
    const message = base64Img.split(",")[1];
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

  componentDidMount(){
    const AuthUI = new firebaseui.auth.AuthUI(firebase.auth());
    this.setState({firebaseui: AuthUI});
    firebase.auth().onAuthStateChanged((user) => {
      // The observer is also triggered when the user's token has expired and is
      // automatically refreshed. In that case, the user hasn't changed so we should
      // not update the UI.

      if(user){
        this.setState({currentUid: user.uid});
        let usersRef = firebase.database().ref('users/' + user.uid + '/socialImgUrl');
        usersRef.on("value", (result) => {
          console.log("added");
          this.updateProfilePicture();
        });

      }else{
        this.setState({currentUid: null});
        this.props.router.push("/login");
      }
    });
  }

  isShowNavbar(){
    const pathName = this.props.location.pathname;
    return pathName != "/login";
  }

  render() {
    return (
      <Grid fluid={true}>
        <div className="row">
          {this.isShowNavbar()? <AppNavbar history={this.props.history} /> : null}
          {this.props.children && React.cloneElement(this.props.children, {
            uiConfig: this.props.uiConfig,
            firebaseui: this.state.firebaseui
          })}
          <Footer />
        </div>
      </Grid>
    );
  }
}

App.defaultProps = {
  uiConfig: {
    signInSuccessUrl: "/",
    'callbacks': {
      // Called when the user has been successfully signed in.
      'signInSuccess'(user, credential, redirectUrl) {
        const socket = io.connect('http://localhost:4000');
        socket.emit('checkAndUpdateUsersTable', user, credential);
        console.log(user);
        //handleSignedInUser(user);
        // Do not redirect.
        setTimeout(function(){
          browserHistory.push("/");
        }, 300);
        return false;
      }
    },
    // Opens IDP Providers sign-in flow in a popup.
    'signInFlow': 'popup',
    'signInOptions': [
      // TODO(developer): Remove the providers you don't need for your app.
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        scopes: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profiles.read', 'https://www.googleapis.com/auth/userinfo.profile']
      },
      {
        provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        scopes :[
          'public_profile',
          'email',
          'user_likes',
          'user_friends'
        ]
      },
      firebase.auth.TwitterAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    'tosUrl': 'https://www.google.com'
  }
};

export default withRouter(App);