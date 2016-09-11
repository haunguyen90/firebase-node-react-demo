/**
 * Created by haunguyen on 9/11/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {PageHeader, Grid, Row, Col, Thumbnail, Button} from 'react-bootstrap';
import {ENUMS} from '~/lib/_required/enums.js';
import {isEmpty, map} from 'underscore';
import DeckItem from './DeckItem.js';


class Dashboard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      decksObject: {}
    };
  }

  getDecksArray(){
    const {decksObject} = this.state;
    if(!isEmpty(decksObject)){
      const deckKeys = Object.keys(decksObject);
      return map(deckKeys, (deckKey) => {
        return decksObject[deckKey];
      });
    }
    return [];
  }

  componentDidMount(){
    let decksRef = firebase.database().ref("decks");
    decksRef.on("value", (result) => {
      this.setState({decksObject: result.val()})
    })
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