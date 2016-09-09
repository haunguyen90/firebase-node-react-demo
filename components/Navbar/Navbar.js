/**
 * Created by haunguyen on 9/1/16.
 */
import React from 'react';
import {Link} from 'react-router';
//import NavbarStore from '../stores/NavbarStore';
//import NavbarActions from '../actions/NavbarActions';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, Image} from 'react-bootstrap';

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
    return (<Image width={35} height={35} src="/images/avatar_default.jpg" circle />)
  }

  render() {
    return (
      <Navbar inverse>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">Prezent Logo</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="#" onClick={this.GoToDashboard.bind(this)}>Dashboard</NavItem>
          </Nav>
          <Nav pullRight>
            <NavDropdown eventKey={3} title={this.getUserAvatar()} id="prezent-navbar-dropdown">
              <MenuItem eventKey={3.1} onClick={this.goToUserAccount.bind(this)}>View Account</MenuItem>
              <MenuItem eventKey={3.2}>Sign Out</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default AppNavbar;