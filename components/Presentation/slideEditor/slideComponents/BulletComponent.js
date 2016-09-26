/**
 * Created by haunguyen on 9/25/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Thumbnail, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import {extend, map, isArray, each, chain, findIndex, filter} from 'underscore';
import ReactDOM from 'react-dom';
import {Editor, RichUtils, ContentState, EditorState} from 'draft-js';

import RichTextComponent from '../richText/richTextComponent.js';

class BulletComponent extends RichTextComponent {
  constructor(props){
    super(props);

    this.onTab = this._onTab.bind(this);

    this.state = extend({}, this.state);
    this.toggleBlockType = (type) => this.onBulletToggleBlockType(type);
    this.handleKeyCommand = (command) => this.onBulletHandleKeyCommand(command);
    this.onUpdateComponent = this.onBulletUpdateComponent.bind(this);
    this.getParentBlock = this.getParentBlock.bind(this);
  }

  onBulletUpdateComponent(){
    const {editorState} = this.state;
    const RTFMarkup = this.convertEditorToJSON();
    let RTFMarkupString = "";
    try {
      RTFMarkupString = JSON.stringify(RTFMarkup);
    }catch(e){
      console.warn("RTFMarkup JSON is not valid");
    }

    const rawContent = this.convertToRaw(editorState);
    this._updateDatabase(RTFMarkupString, rawContent);
  }

  onBulletToggleBlockType(type){
    if(!this.hasBlockType(type)){
      this._toggleBlockType(type)
    }
  }

  onBulletHandleKeyCommand(command){
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
  }

  getParentBlock(blockArray, currentDepth, index){
    const blockBefore = blockArray[index - 1];

    if(!blockBefore)
      return null;

    const depthBefore = blockBefore.depth;
    if(currentDepth > depthBefore){
      const parentIndex = index - 1;
      const parentBlock = blockBefore;
      return {parentBlock, parentIndex};
    }else{
      return this.getParentBlock(blockArray, currentDepth, index - 1);
    }
  }

  convertEditorToJSON(){
    const {editorState} = this.state;
    const contentState = editorState.getCurrentContent();
    var blockArray = contentState.getBlocksAsArray();
    let points = [];




    if(isArray(blockArray)){
      blockArray = map(blockArray, (block) => {
        block.id = block.getKey();
        return block;
      });

      points = map(blockArray, (block) => {
        const newContentState = ContentState.createFromBlockArray([block]);
        const newEditorState = EditorState.createWithContent(newContentState);
        const RTFMarkup = this.getRTFContent(newEditorState);
        const DOM = $.parseHTML(RTFMarkup);
        let htmlContent = block.text;
        if(DOM[0] && DOM[0].firstElementChild){
          htmlContent = DOM[0].firstElementChild.innerHTML;
        }
        let bulletType = "numeric";
        if(block.type == "unordered-list-item")
          bulletType = "bulletPoint";

        return {
          text: htmlContent,
          bulletType: bulletType,
          depth: block.getDepth(),
          id: block.getKey()
        };
      });

      let i = 0, j = points.length - 1;
      for(j; j >= i; j--){
        const currentBlock = points[j];
        const parentObject = this.getParentBlock(points, currentBlock.depth, j);
        if(parentObject){
          const {parentBlock, parentIndex} = parentObject;
          if(!parentBlock.points)
            parentBlock.points = [];

          parentBlock.points.unshift(currentBlock);
          points[parentIndex] = parentBlock;
        }
      }

      points = filter(points, (block) => {
        return block.depth == 0;
      });

    }
    return points;
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