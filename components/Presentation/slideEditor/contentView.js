/**
 * Created by haunguyen on 9/15/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';

class ContentView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(){
    return (
      <div className="content-view-component">
        <Panel header="SLIDE 3" footer="Panel footer">
          <div>content</div>
        </Panel>
      </div>
    )
  }
}

export default withRouter(ContentView, {withRef: true});