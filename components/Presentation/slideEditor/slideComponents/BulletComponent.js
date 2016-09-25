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
    this.toggleBlockType = (type) => {
      if(!this.hasBlockType(type)){
        this._toggleBlockType(type)
      }
    };

    this.handleKeyCommand = (command) => {
      if(command == "backspace"){
        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if(newState){
          const blockType = newState.getCurrentContent().getFirstBlock().getType();
          if(blockType == "unstyled"){
            return;
          }
        }
      }
      this._handleKeyCommand(command);

    };

  }

  _onTab(event) {
    let maxDepth = 4;
    this.handleChange(RichUtils.onTab(event, this.state.editorState, maxDepth));
  }

  hasBlockType(blockType){
    const {editorState} = this.state;
    const selection = editorState.getSelection();
    const key = selection.getAnchorKey();
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(key);
    const type = block.getType();

    if(blockType){
      return (type == blockType);
    }

    return (type == 'unordered-list-item' || type == 'ordered-list-item');
  }

  componentDidMount(){
    if(!this.hasBlockType())
      this.toggleBlockType("unordered-list-item");
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