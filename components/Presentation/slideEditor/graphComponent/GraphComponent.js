/**
 * Created by haunguyen on 9/29/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Thumbnail, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import {extend, map, each, isArray} from 'underscore';
import ReactDOM from 'react-dom';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import SlideComponent from '../slideComponents/SlideComponent.js';

class GraphComponent extends SlideComponent {
  constructor(props) {
    super(props);

    this.rowGetter = this.rowGetter.bind(this);
    this.handleRowUpdated = this.handleRowUpdated.bind(this);
  }

  rowGetter (rowIdx){
    return this.state.rows[rowIdx];
  }

  handleRowUpdated(e){
    //merge updated row with current row and rerender by setting state
    const rows = this.state.rows;
    Object.assign(rows[e.rowIdx], e.updated);
    this.setState({rows:rows});
  }
}

export default GraphComponent;