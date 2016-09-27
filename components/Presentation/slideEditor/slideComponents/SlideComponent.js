/**
 * Created by haunguyen on 9/15/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import Confirm from 'react-confirm-bootstrap';

class SlideComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onUpdateComponent = (text) => this._onUpdateComponent(text);
    this.onRemoveComponent = this._onRemoveComponent.bind(this);
  }

  _onUpdateComponent(text) {
    // Update single component
    const {selectedSlide, keyId, deckId} = this.props;

    if(selectedSlide.components && selectedSlide.components[keyId]){
      let component = selectedSlide.components[keyId];
      component.text = text;

      let deckDataRef = firebase.database().ref('deckData/' + deckId + '/slides/' + selectedSlide.keyId + '/components/' + keyId);
      deckDataRef.set(component);
    }
  }

  handleBlur(event){
    event.preventDefault();

    // Update single component
    const {selectedSlide, keyId, deckId} = this.props;

    if(selectedSlide.components && selectedSlide.components[keyId]){
      let component = selectedSlide.components[keyId];
      component.text = this.state.text;

      let deckDataRef = firebase.database().ref('deckData/' + deckId + '/slides/' + selectedSlide.keyId + '/components/' + keyId);
      deckDataRef.set(component);
    }
  }

  _onRemoveComponent(){
    // Remove single component
    const {selectedSlide, keyId, deckId} = this.props;
    if(selectedSlide.components && selectedSlide.components[keyId]){
      selectedSlide.components.splice(keyId,1);
      let deckDataRef = firebase.database().ref('deckData/' + deckId + '/slides/' + selectedSlide.keyId + '/components/');
      deckDataRef.set(selectedSlide.components);
    }

  }

  renderConfirmDeleteComponent(){
    return (
      <Confirm
        onConfirm={this.onRemoveComponent}
        body="Are you sure you want to remove this component?"
        confirmText="Confirm Delete"
        title={"Deleting Component"}>
        <a href="#" className="remove-component">Remove</a>
      </Confirm>
    )
  }

  render(){
    return (
      <div className="slide-component">
      </div>
    )
  }
}

SlideComponent.propTypes = {
  keyId: React.PropTypes.number,
  componentData: React.PropTypes.object,
  deckId: React.PropTypes.string,
  selectedSlide: React.PropTypes.object
};

export default SlideComponent;