/**
 * Created by haunguyen on 9/25/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Thumbnail, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import {extend} from 'underscore';
import ReactDOM from 'react-dom';
import {Editor, RichUtils} from 'draft-js';

import RichTextComponent from '../richText/richTextComponent.js';

class BulletComponent extends RichTextComponent {
  constructor(props){
    super(props);

    this.onTab = this._onTab.bind(this);

    this.state = extend({}, this.state);

  }

  _onTab(event) {
    console.log(event);
    let maxDepth = 4;
    console.log(this._convertToRaw());
    const newEditor = RichUtils.onTab(event, this.state.editorState, 4);
    console.log(this._convertToRaw(newEditor));
    this.handleChange(RichUtils.onTab(event, this.state.editorState, 4));
  }

  render(){
    const {keyId} = this.props;
    const {editorState} = this.state;

    return (
      <div className="slide-component bullet-component row">
        <Col sm={12}>
          <FormGroup controlId={"bulletComponent-" + keyId}>
            <ControlLabel>BULLETS</ControlLabel>
            {this.renderConfirmDeleteComponent()}

            <div className="RichEditor-root">
              {this.renderBlockType()}
              {this.renderInlineStyle()}
              <div className="RichEditor-editor">
                <Editor
                  customStyleMap={this.props.customStyleMap}
                  editorState={editorState}
                  handleKeyCommand={this.handleKeyCommand}
                  onChange={this.handleChange}
                  onTab={this.onTab}
                  onBlur={this.handleBlur}
                />
              </div>
            </div>
            <FormControl.Feedback />
          </FormGroup>
        </Col>
      </div>
    )
  }

}

BulletComponent.propTypes = {
  keyId: React.PropTypes.number,
  componentData: React.PropTypes.object,
  deckId: React.PropTypes.string,
  selectedSlide: React.PropTypes.object
};

export default withRouter(BulletComponent, {withRef: true});