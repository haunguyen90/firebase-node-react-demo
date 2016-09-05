/**
 * Created by haunguyen on 9/2/16.
 */
import React from 'react';
import {Router, browserHistory} from 'react-router';
import ReactDOM from 'react-dom';
//import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './routes';
import Navbar from './components/Navbar/Navbar.js';

//let history = createBrowserHistory();
import firebase from "firebase";

 //Initialize Firebase
var config = {
  apiKey: "AIzaSyCajHCcMiTctSbFjejAdvAc7Q3Bt38xwPA",
  authDomain: "prezvr.firebaseapp.com",
  databaseURL: "https://prezvr.firebaseio.com",
  storageBucket: "prezvr.appspot.com",
};
firebase.initializeApp(config);

ReactDOM.render(<Router history={browserHistory}>{routes}</Router>, document.getElementById('container'));