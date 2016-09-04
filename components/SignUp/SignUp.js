/**
 * Created by haunguyen on 9/2/16.
 */
/**
 * Created by haunguyen on 9/2/16.
 */
import React from 'react';
import {Link} from 'react-router';
import { withRouter } from 'react-router'

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUid: null,
      SIGN_UP_ERROR: null
    };
  }

  writeNewUser(uid, name, picUrl){
    const newUser = {
      id: uid,
      name: name,
      picUrl: picUrl
    };

    const Database = firebase.database();
    const newUserKey = Database.ref().child('users').push().key;

    let updates = {};
    updates['/users/' + newUserKey] = newUser;
    return Database.ref().update(updates);
  }

  onSignUpSubmit(e){
    e.preventDefault();
    this.setState({SIGN_UP_ERROR: null});
    const fullName = this.refs.fullName.value.trim();
    const email = this.refs.email.value.trim();
    const confirmEmail = this.refs.confirmEmail.value.trim();
    const password = this.refs.password.value.trim();

    const emailPatt = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!emailPatt.test(email)){
      this.setState({SIGN_UP_ERROR: {
        code: "auth/email-invalid",
        message: "Email is not valid"
      }});
      return false;
    }

    if(email != confirmEmail){
      this.setState({SIGN_UP_ERROR: {
        code: "auth/email-does-not-match",
        message: "Emails don’t match"
      }});
      return false;
    }

    if (password.length < 6) {
      this.setState({SIGN_UP_ERROR: {
        code: "auth/password-length",
        message: "Password minimum 6 characters"
      }});
      return false;
    }

    const pattern = /^[a-z0-9]+$/i;
    if(!pattern.test(password)){
      this.setState({SIGN_UP_ERROR: {
        code: "auth/password-invalid",
        message: "Password must be alphanumeric"
      }});
      return false;
    }

    const Auth = firebase.auth();

    // Sign in with email and pass.
    // [START createwithemail]
    Auth.createUserWithEmailAndPassword(email, password).then((user) => {
      console.log(user);
      user.updateProfile({
        displayName: fullName,
        photoURL: "https://firebasestorage.googleapis.com/v0/b/newauth-e3860.appspot.com/o/avatar_default.jpg?alt=media&token=684f1704-5d7b-4df9-8aab-e717bc4baeac"
      }).then(() => {
        this.props.router.push('/');
        this.setState({SIGN_UP_ERROR: null});
        this.writeNewUser(user.uid, fullName, user.photoURL);
      }, (error) => {
        // An error happened.
        this.setState({SIGN_UP_ERROR: error});
      });
    }, (error) => {
      // Handle Errors here.
      this.setState({SIGN_UP_ERROR: error});

    });
    // [END createwithemail]
  }

  switchToSocial(){
    this.props.router.push("/login");
  }

  render(){
    return (
      <div className="login-page">

        <form onSubmit={this.onSignUpSubmit.bind(this)} className="signup-form">
          <h4>SIGN-UP</h4>
          <span className="form-error-block">
            {this.state.SIGN_UP_ERROR?
              this.state.SIGN_UP_ERROR.message : null
            }
          </span>
          <div className="">
            <div className="input-field">
              <input type="text" className="full-name validate" required ref="fullName" placeholder="Full Name"/>
            </div>
            <div className="input-field">
              <input type="text" className="email validate" required ref="email" placeholder="Email"/>
            </div>
            <div className="input-field">
              <input type="text" className="confirm-email validate" required ref="confirmEmail" placeholder="Confirm Email"/>
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
      </div>
    )
  }
}

export default withRouter(SignUp);