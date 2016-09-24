/**
 * Created by haunguyen on 9/2/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {PageHeader, FormGroup, ControlLabel, FormControl, HelpBlock, Alert, Image, Button} from 'react-bootstrap';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUid: null,
      loginWithPassword: false,
      LOGIN_ERROR: null,
      FIREBASEUI_DID_MOUNT: null,
      observerAuth: null
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
    document.getElementById('user-signed-out').style.display = 'block';
    this.props.firebaseui.start('#firebaseui-container', this.props.uiConfig);
    this.setState({FIREBASEUI_DID_MOUNT: true});
  }

  componentDidUpdate(preProps, preState){
    if(preState.loginWithPassword != this.state.loginWithPassword && this.state.loginWithPassword == false){
      this.handleSignedOutUser();
    }
  }

  componentDidMount(){
    this.setState({FIREBASEUI_DID_MOUNT: null});
    const observerAuth = firebase.auth().onAuthStateChanged((user) => {
      // The observer is also triggered when the user's token has expired and is
      // automatically refreshed. In that case, the user hasn't changed so we should
      // not update the UI.
      if (user && user.uid == this.state.currentUid) {
        return;
      }
      if(user){
        this.setState({currentUid: user.uid});
        this.props.router.push('/');
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

    this.setState({observerAuth: observerAuth});

    //const socket = io.connect('http://localhost:4000');
    //socket.on('redirectUserToHome', (user) => {
    //  const currentUser = firebase.auth().currentUser;
    //  this.props.router.push("/");
    //});

  }

  componentWillUnmount(){
    const observerAuth = this.state.observerAuth;
    if(observerAuth && typeof observerAuth == 'function'){
      // Unsubscribe auth change
      observerAuth();
    }
    this.props.firebaseui.reset();
  }

  goToSignUp(){
    this.props.router.push('/sign-up');
  }

  switchToLoginWithPassword(){
    this.setState({loginWithPassword: true});
  }

  switchToSocial(){
    this.setState({loginWithPassword: false});
  }

  onLoginSubmit(e){
    e.preventDefault();
    const email = this.refs.email.value.trim();
    const password = this.refs.password.value.trim();

    const emailPatt = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!emailPatt.test(email)){
      this.setState({LOGIN_ERROR: {
        code: "auth/email-invalid",
        message: "Email is not valid"
      }});
      return false;
    }

    firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
      this.props.router.push('/');
      this.setState({LOGIN_ERROR: null});
    }, (error) => {
      this.setState({LOGIN_ERROR: error});
    });

  }

  renderLoginForm(){
    return (
      <form onSubmit={this.onLoginSubmit.bind(this)} className="signup-form">
        <h2>Log In</h2>
          <span className="form-error-block">
            {this.state.LOGIN_ERROR?
              this.state.LOGIN_ERROR.message : null
            }
          </span>
        <div className="">
          <FormGroup controlId="emailInput">
            <FormControl
              type="text"
              className="email validate"
              required
              ref="email"
              placeholder="Email"
            />

          </FormGroup>

          <FormGroup controlId="passwordInput">
            <FormControl
              type="password"
              className="password validate"
              required
              ref="password"
              placeholder="Password"
              />

          </FormGroup>

          <div className="firebaseui-list-item">
            <button type="submit" className="btn btn-lg btn-primary btn-block">
              Sign in
            </button>

            <button onClick={this.switchToSocial.bind(this)}
              type="type" className="btn btn-lg btn-default btn-block ">
              Sign in with a social network
            </button>
          </div>
        </div>
      </form>
    )
  }

  renderSocialLogin(){
    return (
      <div id="main">
        <div id="user-signed-out" className="">
          <div id="firebaseui-spa">
            {this.state.FIREBASEUI_DID_MOUNT && !this.state.currentUid?
              <h2>Login With:</h2> : null
            }

            <div id="firebaseui-container"></div>
            {this.state.FIREBASEUI_DID_MOUNT && !this.state.currentUid?
              <button onClick={this.switchToLoginWithPassword.bind(this)}
                      className="firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised firebaseui-idp-password firebaseui-id-idp-button">
                <img className="firebaseui-idp-icon" src="https://www.gstatic.com/firebasejs/staging/3.0.0/auth/images/mail.svg" data-pin-nopin="true"/>
                <span className="firebaseui-idp-text firebaseui-idp-text-long">Sign in with Email</span>
              </button> : null
            }

          </div>

          {this.state.FIREBASEUI_DID_MOUNT && !this.state.currentUid?
            <div className="sign-up-link">
              <h5>Or :</h5>
              <button onClick={this.goToSignUp.bind(this)}
                      className="firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised firebaseui-id-idp-button">
                Create a new Account
              </button>
            </div> : null
          }
        </div>
      </div>
    )
  }
  
  render(){
    return (
      <div className="login-page">
        <div id="loading">Loading...</div>
        <div id="loaded" className="">
          {this.state.loginWithPassword?
            this.renderLoginForm(): this.renderSocialLogin()
          }
        </div>
      </div>
    )
  }
}

export default withRouter(Login, { withRef: true });