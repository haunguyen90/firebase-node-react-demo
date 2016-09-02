import React from 'react';
import Navbar from '../Navbar/Navbar.js';
import Footer from '../Footer/Footer.js';
import firebase from "firebase";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUid: null
    };
  }

  componentDidMount(){
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
    });
  }

  render() {
    return (
      <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <Navbar history={this.props.history} />
        {this.props.children && React.cloneElement(this.props.children, {
          uiConfig: this.props.uiConfig
        })}
        <Footer />
      </div>
    );
  }
}

App.defaultProps = {
  uiConfig: {
    'callbacks': {
      // Called when the user has been successfully signed in.
      'signInSuccess': function(user, credential, redirectUrl) {
        console.log("abc");
        handleSignedInUser(user);
        // Do not redirect.
        return false;
      }
    },
    // Opens IDP Providers sign-in flow in a popup.
    'signInFlow': 'popup',
    'signInOptions': [
      // TODO(developer): Remove the providers you don't need for your app.
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        scopes: ['https://www.googleapis.com/auth/plus.login']
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
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    'tosUrl': 'https://www.google.com'
  }
};

export default App;