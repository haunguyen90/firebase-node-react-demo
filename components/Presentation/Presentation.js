/**
 * Created by haunguyen on 9/13/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {PageHeader, Row, Col, Tabs, Tab} from 'react-bootstrap';
import {ENUMS} from '~/lib/_required/enums.js';

import DeckSettings from './deckSettings.js';

class Presentation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      observerAuth: null,
      presentationTabActive: 1,
      deckObject: {}
    };

    this.handlePresentationTabSelect = this.handlePresentationTabSelect.bind(this);

  }

  handlePresentationTabSelect(key){
    this.setState({presentationTabActive: key});
  }

  componentDidMount(){
    if(!this.props.params.id)
      return false;

    const observerAuth = firebase.auth().onAuthStateChanged((user) => {
      let presentationRef = firebase.database().ref('decks/' + this.props.params.id);
      if(user){
        presentationRef.on("value", (result) => {
          const deckObject = result.val();
          if(deckObject.uid == user.uid){
            deckObject.id = this.props.params.id;
            this.setState({deckObject: deckObject});
          }else{
            alert("The presentation is not belong to you.");
            // TODO
            // Need to discuss the flow for this case
          }
        });
      }else{
        presentationRef.off();
      }
    });
    this.setState({observerAuth: observerAuth});
  }

  componentWillUnmount(){
    const observerAuth = this.state.observerAuth;
    if(observerAuth && typeof observerAuth == 'function'){
      // Unsubscribe auth change
      observerAuth();
    }
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
              <Tab eventKey={1} title="SETTINGS">
                <DeckSettings
                  deckObject={this.state.deckObject}
                />
              </Tab>
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