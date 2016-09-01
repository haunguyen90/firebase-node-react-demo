/**
 * Created by haunguyen on 9/1/16.
 */
import React from 'react';
import {Link} from 'react-router';
import {first, without, findWhere} from 'underscore';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  onChange(state) {
    this.setState(state);
  }

  handleClick(character) {

  }

  render() {

    return (
      <main className="mdl-layout__content mdl-color--grey-100">
        <div className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
          <div className="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop">
            <div className="mdl-card__title mdl-color--light-blue-600 mdl-color-text--white">
              <h2 className="mdl-card__title-text">Table of Content</h2>
            </div>
            <div className="mdl-card__supporting-text mdl-color-text--grey-600">
              <p>
                There are multiple methods available for authentication with Firebase. Ensure that
                you have added configuration to each file, and that the appropriate method has been
                enabled in the Firebase Console authentication panel. Note: custom auth does not require
                enabling.
              </p>

              <ul>
                <li><a href="anon.html">Anonymous</a></li>
                <li><a href="email.html">Email/Password</a></li>
                <li><a href="customauth.html">Custom Authentication</a> and an Example <a href="exampletokengenerator/auth.html">Custom Token Generator</a><br/><br/></li>

                  <li><a href="google-popup.html">Google Sign In using Popup</a></li>
                  <li><a href="google-redirect.html">Google Sign In using Redirect</a></li>
                  <li><a href="google-credentials.html">Google Sign In using OAuth Credentials (via Google Sign-in Button)</a><br/><br/></li>

                    <li><a href="facebook-popup.html">Facebook Login In using Popup</a></li>
                    <li><a href="facebook-redirect.html">Facebook Login In using Redirect</a></li>
                    <li><a href="facebook-credentials.html">Facebook Login using OAuth Credentials (via Facebook Login Button)</a><br/><br/></li>

                      <li><a href="twitter-popup.html">Twitter Sign In using Popup</a></li>
                      <li><a href="twitter-redirect.html">Twitter Sign In using Redirect</a><br/><br/></li>

                        <li><a href="github-popup.html">GitHub Sign In using Popup</a></li>
                        <li><a href="github-redirect.html">GitHub Sign In using Redirect</a></li>
                      </ul>
                      </div>
                    </div>

                    </div>
                  </main>
    );
  }
}

export default Home;