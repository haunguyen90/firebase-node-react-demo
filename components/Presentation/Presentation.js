/**
 * Created by haunguyen on 9/13/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {PageHeader, Row, Col, Tabs, Tab} from 'react-bootstrap';
import {ENUMS} from '~/lib/_required/enums.js';

class Presentation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      presentationTabActive: 1
    };

    this.handlePresentationTabSelect = this.handlePresentationTabSelect.bind(this);

  }

  handlePresentationTabSelect(key){
    this.setState({presentationTabActive: key});
  }

  render(){
    return (
      <div className="presentation-component">
        <Row className="presentation-header">
          <h1 className="header-title">PrezentVR Pitch Deck</h1>
        </Row>
        <Row>
          <Col xs={12} className="presentation-tabs">
            <Tabs activeKey={this.state.presentationTabActive} onSelect={this.handlePresentationTabSelect} id="presentationTabs">
              <Tab eventKey={1} title="SETTINGS">SETTINGS</Tab>
              <Tab eventKey={2} title="SLIDES">SLIDES</Tab>
              <Tab eventKey={3} title="SHARE">SHARE</Tab>
            </Tabs>
          </Col>
        </Row>
      </div>
    )
  }
}

export default withRouter(Presentation, {withRef: true});