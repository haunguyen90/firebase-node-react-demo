/**
 * Created by haunguyen on 9/2/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUid: null,
      loginWithPassword: false,
      LOGIN_ERROR: null
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
  }

  componentDidUpdate(preProps, preState){
    if(preState.loginWithPassword != this.state.loginWithPassword && this.state.loginWithPassword == false){
      this.handleSignedOutUser();
    }
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
      
      document.getElementById('loading').style.display = 'none';
      document.getElementById('loaded').style.display = 'block';
      if(user)
        this.handleSignedInUser(user);
      else
        this.handleSignedOutUser();
    });
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
        <h4>LOGIN IN</h4>
          <span className="form-error-block">
            {this.state.LOGIN_ERROR?
              this.state.LOGIN_ERROR.message : null
            }
          </span>
        <div className="">
          <div className="input-field">
            <input type="text" className="email validate" required ref="email" placeholder="Email"/>
          </div>
          <div className="input-field">
            <input type="password" className="password validate" required ref="password" placeholder="Password"/>
          </div>

          <div className="firebaseui-list-item">
            <button type="submit" className="firebaseui-id-submit firebaseui-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
              Submit
            </button>

            <button onClick={this.switchToSocial.bind(this)}
              type="type" className="firebaseui-id-submit firebaseui-button mdl-button mdl-js-button mdl-button--raised">
              Switch to social login
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
          <h4>You are signed out.</h4>
          <div id="firebaseui-spa">
            <h5>Login With:</h5>
            <div id="firebaseui-container"></div>
          </div>

          {this.state.currentUid?
            null :
            <div className="sign-up-link">
              <h5>Or :</h5>
              <button onClick={this.goToSignUp.bind(this)}
                      className="firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised firebaseui-id-idp-button">
                Sign-up with Email
              </button>
              <h5>Or :</h5>
              <button onClick={this.switchToLoginWithPassword.bind(this)}
                      className="firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised firebaseui-idp-password firebaseui-id-idp-button">
                <img className="firebaseui-idp-icon" src="https://www.gstatic.com/firebasejs/staging/3.0.0/auth/images/mail.svg" data-pin-nopin="true"/>
                <span className="firebaseui-idp-text firebaseui-idp-text-long">Sign in to your account</span>
              </button>
            </div>
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

export default withRouter(Login);