/**
 * Created by haunguyen on 9/15/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';

class DesignView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(){
    return (
      <div className="design-view-component">
        design view
      </div>
    )
  }
}

export default withRouter(DesignView, {withRef: true});