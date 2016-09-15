/**
 * Created by haunguyen on 9/15/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';

class SlideComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      abd: "hehe"
    };

  }

  testParentFunction(){
    console.log(this.state);
  }

  render(){
    return (
      <div className="slide-component">
      </div>
    )
  }
}

export default SlideComponent;