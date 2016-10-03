/**
 * Created by haunguyen on 9/11/16.
 */
import React from 'react';
import {withRouter} from 'react-router';
import {PageHeader, Grid, Row, Col, Thumbnail, Button} from 'react-bootstrap';
import ENUMS from '~/lib/_required/enums.js';
import {isEmpty, map} from 'underscore';
import SharingDeckModal from './SharingDeckModal.js';

class DeckItem extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  openShareWindow(){
    this.setState({showModal: true});
  }

  closeShareWindow(){
    this.setState({showModal: false});
  }

  getDeckUrl(){
    const getUrl = window.location;
    const baseUrl = getUrl .protocol + "//" + getUrl.host + "/presentation/" + this.props.deckData.id;
    return baseUrl;
  }

  onEditDeck(){
    this.props.router.push("presentation/" + this.props.deckData.id);
  }

  render() {
    const {deckData} = this.props;
    return (
      <div className="deck-item-component">
        <Thumbnail src={deckData.cover ? deckData.cover : "images/avatar_default.jpg"} alt="242x200">
          <h3 className="deck-item-title">{deckData.name}</h3>
          <p>{deckData.description}</p>
          <p>
            <Button bsStyle="primary" onClick={this.onEditDeck.bind(this)}>Edit</Button>&nbsp;
            <Button bsStyle="default" onClick={this.openShareWindow.bind(this)}>Share</Button>
          </p>
        </Thumbnail>
        <SharingDeckModal
          showModal={this.state.showModal}
          closeShareWindow={this.closeShareWindow.bind(this)}
          deckUrl={this.getDeckUrl()}
          name={deckData.name}
        />
      </div>
    )
  }
}

DeckItem.propTypes = {
  deckData: React.PropTypes.object
};

export default withRouter(DeckItem);
