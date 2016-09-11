import React from 'react';
import {Route} from 'react-router';
import App from '../components/App/App.jsx';
import Home from '../components/Home/Home.js';
import Login from '../components/Login/Login.js';
import SignUp from '../components/SignUp/SignUp.js';
import UserAccount from '../components/Account/UserAccount.js';
import Dashboard from '../components/Dashboard/Dashboard.js';

import firebase from "firebase";

const requiredLogin = (nextState, replace, callback) => {
  if(!firebase.auth().currentUser){
    replace("/login");
  }
  callback();
};

const isLoggedIn = (nextState, replace, callback) => {
  if(firebase.auth().currentUser){
    replace("/");
  }
  callback();
};

const test = {abd: "aa"};

export default (
  <Route component={App}>
    <Route path='/' component={Home}/>
    <Route path='/login' component={Login}/>
    <Route path='/sign-up' component={SignUp} />
    <Route path='/dashboard' component={Dashboard}/>
    <Route path='/account' component={UserAccount}/>
  </Route>
);