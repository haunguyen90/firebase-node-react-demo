/**
 * Created by haunguyen on 9/2/16.
 */
/**
 * Created by haunguyen on 9/2/16.
 */
import React from 'react';
import {Link} from 'react-router';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUid: null
    };
  }

  onSignUpSubmit(e){
    e.preventDefault();
  }

  render(){
    return (
      <div className="login-page">
        <form onSubmit={this.onSignUpSubmit.bind(this)} className="signup-form">
          <div className="">
            <div className="input-field">
              <input type="text" className="full-name validate" ref="fullName" placeholder="Full Name"/>
            </div>
            <div className="input-field">
              <input type="text" className="email validate" ref="email" placeholder="Email"/>
            </div>
            <div className="input-field">
              <input type="text" className="confirm-email validate" ref="confirmEmail" placeholder="Confirm Email"/>
            </div>
            <div className="input-field">
              <input type="text" className="password validate" ref="password" placeholder="Password"/>
            </div>

            <div className="firebaseui-list-item">
              <button className="firebaseui-id-submit firebaseui-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default SignUp;