/**
 * Created by haunguyen on 9/1/16.
 */
import React from 'react';
import {Link} from 'react-router';
import { withRouter } from 'react-router'
import {isEmpty, map} from 'underscore';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: {},
      socket: null,
      socialUserMissingEmail: null,
      COMPLETE_SIGN_UP_ERROR: null
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    let users = firebase.database().ref('users');
    users.on("value", (result) => {
      const users = result.val();
      console.log(users);
      this.setState({users: users});
    });

    firebase.auth().onAuthStateChanged((user) => {
      // The observer is also triggered when the user's token has expired and is
      // automatically refreshed. In that case, the user hasn't changed so we should
      // not update the UI.

      if(user){
        if(!user.email)
          this.setState({socialUserMissingEmail: true});
      }
    });

  }

  componentWillUnmount() {
    //const socket = io.connect('http://localhost:4000');
    //socket.on('socialUserMissingEmail', () => {
    //  this.setState({socialUserMissingEmail: true});
    //});
  }

  onChange(state) {
    this.setState(state);
  }

  getUsersArray(){
    const {users} = this.state;
    if(!isEmpty(users)){
      const userKeys = Object.keys(users);
      return map(userKeys, (userKey) => {
        return users[userKey];
      })
    }
    return [];
  }

  getCurrentUser(){
    const user = firebase.auth().currentUser;
    return user;
  }

  onSignOut(e){
    e.preventDefault();
    firebase.auth().signOut().then(() => {
      this.props.router.push('/login');
    }, (error) => {
      // An error happened.
    });
  }

  renderUsersCollection(){
    return (
      <ul className="collection">

        {this.getUsersArray().map((user, index) => {
          let activeClass = "";
          if(this.getCurrentUser().uid == user.id)
            activeClass = "active";

          return (
            <li className={"collection-item avatar " + activeClass} key={index}>
              <img src={user.picUrl} alt="" className="circle"/>
              <span className="title">{user.name}</span>
              <p>First Line <br/>
                Second Line
              </p>
              <a href="#!" className="secondary-content"><i className="material-icons">grade</i></a>
            </li>
          )
        })}
      </ul>
    )
  }

  getUserName(){
    if(firebase && firebase.auth() && firebase.auth().currentUser)
      return firebase.auth().currentUser.displayName;
  }

  onCompleteSignUp(e){
    e.preventDefault();
    const email = this.refs.email.value.trim();
    const emailPatt = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!emailPatt.test(email)){
      this.setState({COMPLETE_SIGN_UP_ERROR: {
        code: "auth/email-invalid",
        message: "Email is not valid"
      }});
      return false;
    }
    const user = firebase.auth().currentUser;
    user.updateEmail(email).then(() => {
      this.setState({socialUserMissingEmail: null});
    }, (error) => {
      this.setState({COMPLETE_SIGN_UP_ERROR: error});
    });
  }

  renderCompleteSignup(){
    return (
      <div className="complete-sign-up">
        <form onSubmit={this.onCompleteSignUp.bind(this)} className="signup-form">
          <h4>COMPLETE SIGN UP</h4>
          <div>Please enter an email address to complete your registration. </div>
          <br/>
          <span className="form-error-block">
            {this.state.COMPLETE_SIGN_UP_ERROR?
              this.state.COMPLETE_SIGN_UP_ERROR.message : null
            }
          </span>
          <div className="user-name">
            <span>{this.getUserName()}</span>
          </div>
          <div className="">
            <div className="input-field">
              <input type="text" className="email validate" required ref="email" placeholder="Email"/>
            </div>
            <div className="firebaseui-list-item">
              <button type="submit" className="firebaseui-id-submit firebaseui-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                Complete Registration
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }

  render() {

    return (
      <div className="home-page">
        <button type="button" onClick={this.onSignOut.bind(this)}
                className="firebaseui-id-submit firebaseui-button mdl-button mdl-js-button mdl-button--raised">
          Sign out
        </button>

        {this.state.socialUserMissingEmail?
          this.renderCompleteSignup() : this.renderUsersCollection()
        }


      </div>
    );
  }
}

export default withRouter(Home);