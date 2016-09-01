/**
 * Created by haunguyen on 9/1/16.
 */
import React from 'react';
import {Link} from 'react-router';
//import FooterStore from '../stores/FooterStore'
//import FooterActions from '../actions/FooterActions';

class Footer extends React.Component {
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

  render() {
    return (
      <footer>
      </footer>
    );
  }
}

export default Footer;