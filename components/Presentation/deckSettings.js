/**
 * Created by haunguyen on 9/14/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {PageHeader, Row, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import {ENUMS} from '~/lib/_required/enums.js';

class DeckSettings extends React.Component {
  constructor (props){
    super(props);
    this.state = {
      deckTitle: props.deckObject.name,
      deckSummary: props.deckObject.description
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.getValidateDeckTitle = this.getValidateDeckTitle.bind(this);
    this.getValidateDeckSummary = this.getValidateDeckSummary.bind(this);
  }

  getValidateDeckTitle(){
    const {deckTitle} = this.state;
    if (deckTitle === ""){
      return 'error';
    }

  }

  getValidateDeckSummary(){

  }

  handleChange(event){
    event.preventDefault();

    const value = event.target.value;
    const field = event.target.name;

    switch (field){
      case "deckTitle":
        this.setState({deckTitle: value});
        break;

      case "deckSummary":
        this.setState({deckSummary: value});
        break;
    }
  }

  handleBlur(event){
    event.preventDefault();

    const value = event.target.value.trim();
    const field = event.target.name;

    const {deckObject} = this.props;

    let presentationRef = firebase.database().ref('decks/' + deckObject.id);
    let updates = {};

    switch (field){
      case "deckTitle":
        updates['/name/'] = value;
        if(value)
          presentationRef.update(updates);
        break;

      case "deckSummary":
        updates['/description/'] = value;
        presentationRef.update(updates);
        break;
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(JSON.stringify(prevProps.deckObject) != JSON.stringify(this.props.deckObject)){
      if(this.props.deckObject && this.props.deckObject.name){
        this.setState({
          deckTitle: this.props.deckObject.name,
          deckSummary: this.props.deckObject.description
        })
      }
    }
  }

  render() {
    return (
      <div className="deck-settings-component">
        <div className="col-sm-6 col-sm-offset-3">
          <Panel header="DECK SETTINGS">
            <form className="deck-setting-frm">
              <FormGroup controlId="deckTitle"
                         validationState={this.getValidateDeckTitle()}>
                <ControlLabel>TITLE</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.deckTitle}
                  placeholder="Enter deck title"
                  name="deckTitle"
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  />
                <FormControl.Feedback />
                {this.getValidateDeckTitle() == 'error'?
                  <HelpBlock>Please give your presentation a title.</HelpBlock> : null
                }

              </FormGroup>

              <FormGroup controlId="deckSummary"
                         validationState={this.getValidateDeckSummary()}>
                <ControlLabel>SUMMARY</ControlLabel>
                <FormControl
                  componentClass="textarea"
                  className="textarea-non-resize"
                  value={this.state.deckSummary}
                  placeholder="Enter deck title"
                  name="deckSummary"
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  />
                <FormControl.Feedback />
                <HelpBlock></HelpBlock>
              </FormGroup>

              <FormGroup controlId="visibility">
                <ControlLabel>VISIBILITY</ControlLabel>
                <ButtonGroup className="button-group-visibility">
                  <Button>PUBLIC</Button>
                  <Button>PRIVATE</Button>
                </ButtonGroup>
              </FormGroup>
            </form>
          </Panel>
        </div>
      </div>
    )
  }
}

export default withRouter(DeckSettings, {withRef: true});