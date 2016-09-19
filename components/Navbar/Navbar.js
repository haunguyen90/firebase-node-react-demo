/**
 * Created by haunguyen on 9/1/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
//import NavbarStore from '../stores/NavbarStore';
//import NavbarActions from '../actions/NavbarActions';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, Image} from 'react-bootstrap';
import {ENUMS} from '~/lib/_required/enums.js';

class AppNavbar extends React.Component {
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

  GoToDashboard(event) {
    event.preventDefault();
    this.props.router.push('/dashboard');
  }

  goToUserAccount(event){
    event.preventDefault();
    this.props.router.push('/account');
  }

  getUserAvatar(){
    return (<Image width={35} height={35} src={this.picUrl()} circle />)
  }

  picUrl(){
    if(this.props.currentUserData && this.props.currentUserData.picUrl){
      return this.props.currentUserData.picUrl;
    }
    return ENUMS.MISC.AVATAR_DEFAULT;
  }

  signOut(){
    firebase.auth().signOut();
  }

  login(event){
    event.preventDefault();
    this.props.router.push('/login');
  }

  render() {
    let isLoggedInClass = "";
    if(this.props.currentUserData)
      isLoggedInClass = "logged-in";

    return (
      <Navbar inverse>
        <Navbar.Header>
          <Navbar.Brand>
            <a className={"prezent-vr-logo " + isLoggedInClass} href="#">

            </a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          {this.props.currentUserData?
            <Nav>
              <NavItem className="left-menu-item" eventKey={1} href="#" onClick={this.GoToDashboard.bind(this)}>Dashboard</NavItem>
            </Nav> : null
          }

          <Nav pullRight>
            {this.props.currentUserData?
              <NavDropdown eventKey={3} title={this.getUserAvatar()} id="prezent-navbar-dropdown">
                <MenuItem eventKey={3.1} onClick={this.goToUserAccount.bind(this)}>View Account</MenuItem>
                <MenuItem eventKey={3.2} onClick={this.signOut.bind(this)}>Sign Out</MenuItem>
              </NavDropdown> :
              <NavItem eventKey={3} href="#" onClick={this.login.bind(this)}>Sign In</NavItem>
            }

          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default withRouter(AppNavbar);