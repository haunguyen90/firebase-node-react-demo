/**
 * Created by haunguyen on 9/2/16.
 */
import React from 'react';
import Router from 'react-router';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './routes';
import Navbar from './components/Navbar/Navbar.js';

let history = createBrowserHistory();
import firebase from "firebase";

 //Initialize Firebase
var config = {
  apiKey: "AIzaSyDTISYMfeSr1zwR5Kky3R2c0yS_vpP8aUo",
  authDomain: "newauth-e3860.firebaseapp.com",
  databaseURL: "https://newauth-e3860.firebaseio.com",
  storageBucket: "newauth-e3860.appspot.com"
};
firebase.initializeApp(config);

ReactDOM.render(<Router history={history}>{routes}</Router>, document.getElementById('container'));