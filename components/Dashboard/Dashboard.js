/**
 * Created by haunguyen on 9/11/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {PageHeader, Grid, Row, Col, Thumbnail, Button} from 'react-bootstrap';
import {ENUMS} from '~/lib/_required/enums.js';
import {isEmpty, map, extend} from 'underscore';
import DeckItem from './DeckItem.js';


class Dashboard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      decksObject: {},
      observerAuth: null
    };
  }

  getDecksArray(){
    const {decksObject} = this.state;
    if(!isEmpty(decksObject)){
      const deckKeys = Object.keys(decksObject);
      return map(deckKeys, (deckKey) => {
        let dataObject = decksObject[deckKey];
        dataObject.id = deckKey;
        return dataObject;
      });
    }
    return [];
  }

  componentDidMount(){
    const observerAuth = firebase.auth().onAuthStateChanged((user) => {
      if(user){
        let decksRef = firebase.database().ref("decks");
        decksRef.orderByChild("uid").equalTo("XXX").on("value", (result) => {
          this.setState({decksObject: result.val()});
        })
      }else{
        let decksRef = firebase.database().ref("decks");
        decksRef.off();
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
    let decksRef = firebase.database().ref("decks");
    decksRef.off();
  }

  render(){
    return (
      <div className="dashboard-component container">
        <PageHeader>DASHBOARD</PageHeader>
        <Grid>
          <Row>
            {this.getDecksArray().map((deck, index) => {
              return (
                <Col xs={6} md={4} key={index}>
                  <DeckItem deckData={deck}/>
                </Col>
              )
            })}
          </Row>
        </Grid>
      </div>
    )
  }
}

export default withRouter(Dashboard);