/**
 * Created by haunguyen on 9/15/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';

class SlideComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

  }

  handleBlur(event){
    event.preventDefault();
    const {selectedSlide, keyId, deckId} = this.props;

    if(selectedSlide.components && selectedSlide.components[keyId]){
      let component = selectedSlide.components[keyId];
      component.text = this.state.text;

      let deckDataRef = firebase.database().ref('deckData/' + deckId + '/slides/' + selectedSlide.keyId + '/components/' + keyId);
      deckDataRef.set(component);
    }
  }

  render(){
    return (
      <div className="slide-component">
      </div>
    )
  }
}

export default SlideComponent;