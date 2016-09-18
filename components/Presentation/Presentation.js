/**
 * Created by haunguyen on 9/13/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {PageHeader, Row, Col, Tabs, Tab} from 'react-bootstrap';
import {extend} from 'underscore';
import {ENUMS} from '~/lib/_required/enums.js';

import DeckSettings from './deckSettings.js';
import DeckSlides from './deckSlides.js';

class Presentation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      observerAuth: null,
      presentationTabActive: 1,
      deckObject: {},
      deckData: {}
    };

    this.handlePresentationTabSelect = this.handlePresentationTabSelect.bind(this);

  }

  handlePresentationTabSelect(key){
    this.setState({presentationTabActive: key});
  }

  getPresentationName(){
    const {deckObject} = this.state;
    if(deckObject && deckObject.name)
      return deckObject.name;
  }

  componentDidMount(){
    if(!this.props.params.id)
      return false;

    const observerAuth = firebase.auth().onAuthStateChanged((user) => {
      let presentationRef = firebase.database().ref('decks/' + this.props.params.id);
      let deckDataRef = firebase.database().ref('deckData/' + this.props.params.id);
      if(user){
        presentationRef.on("value", (result) => {
          const deckObject = result.val();
          deckObject.id = this.props.params.id;
          this.setState({deckObject: deckObject});
          if(deckObject.uid == user.uid){
            // TODO
          }else{
            //alert("The presentation is not belong to you.");
            // TODO
            // Need to discuss the flow for this case
          }
        });

        deckDataRef.on("value", (result) => {
          const deckData = result.val();
          this.setState({deckData: deckData});
        });

      }else{
        presentationRef.off();
        deckDataRef.off();
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
    let presentationRef = firebase.database().ref('decks/' + this.props.params.id);
    presentationRef.off();
    let deckDataRef = firebase.database().ref('deckData/' + this.props.params.id);
    deckDataRef.off();
  }

  render(){
    return (
      <div className="presentation-component">
        <Row className="presentation-header">
          <Col xs={12}>
            <h1 className="header-title">{this.getPresentationName()}</h1>
          </Col>
        </Row>
        <Row>
          <div className="presentation-tabs">
            <Tabs activeKey={this.state.presentationTabActive} onSelect={this.handlePresentationTabSelect} id="presentationTabs">
              <Tab eventKey={1} title="SETTINGS">
                <DeckSettings
                  deckObject={this.state.deckObject}
                />
              </Tab>
              <Tab eventKey={2} title="SLIDES">
                <DeckSlides
                  deckObject={this.state.deckObject}
                  deckData={this.state.deckData}
                />
              </Tab>
              <Tab eventKey={3} title="SHARE">SHARE</Tab>
            </Tabs>
          </div>
        </Row>
      </div>
    )
  }
}

export default withRouter(Presentation, {withRef: true});