/**
 * Created by haunguyen on 9/1/16.
 */
import React from 'react';
import {Link} from 'react-router';
import {isEmpty, map} from 'underscore';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: {}
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    let users = firebase.database().ref('users');
    users.on("value", (userData) => {
      console.log(userData.val());
      this.setState({users: userData.val()});
    })
  }

  componentWillUnmount() {

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
      this.props.history.push('/login');
    }, (error) => {
      // An error happened.
    });
  }

  render() {

    return (
      <div className="home-page">
        <button type="button" onClick={this.onSignOut.bind(this)}
                className="firebaseui-id-submit firebaseui-button mdl-button mdl-js-button mdl-button--raised">
          Sign out
        </button>

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
      </div>
    );
  }
}

export default Home;