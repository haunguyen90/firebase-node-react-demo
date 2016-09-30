/**
 * Created by haunguyen on 9/25/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Thumbnail, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import {extend, map, isArray, each, chain, findIndex, filter} from 'underscore';
import ReactDOM from 'react-dom';
import {Editor, RichUtils, ContentState, EditorState, getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
import adjustBlockDepthForContentState from "~/node_modules/draft-js/lib/adjustBlockDepthForContentState.js"
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
    this.KeyBindingUtil = KeyBindingUtil;
    const {hasCommandModifier} = this.KeyBindingUtil;
    this.hasCommandModifier = hasCommandModifier;
    this.myKeyBindingFn = this.myKeyBindingFn.bind(this);
  }

  myKeyBindingFn(e: SyntheticKeyboardEvent): string {
    if(e.keyCode == 13){
      const {editorState} = this.state;
      let maxDepth = 4;
      const selection = editorState.getSelection();
      const key = selection.getAnchorKey();
      if (key !== selection.getFocusKey()) {
        return "not-handle";
      }

      const content = editorState.getCurrentContent();
      const block = content.getBlockForKey(key);
      const type = block.getType();
      if (type !== 'unordered-list-item' && type !== 'ordered-list-item') {
        return "not-handle";
      }

      e.preventDefault();

      // Only allow indenting one level beyond the block above, and only if
      // the block above is a list item as well.
      const blockAbove = content.getBlockBefore(key);
      if (!blockAbove) {
        return getDefaultKeyBinding(e);
      }

      const typeAbove = blockAbove.getType();
      if (
        typeAbove !== 'unordered-list-item' &&
        typeAbove !== 'ordered-list-item'
      ) {
        return "not-handle";
      }

      const depth = block.getDepth();
      const depthAbove = blockAbove.getDepth();
      //if (!event.shiftKey && depth === maxDepth) {
      //  return editorState;
      //}

      const textAbove = blockAbove.getText();

      const currentText = block.getText();

      // commented out because we don't allow the user add a null string bullet
      //if(depth == 0 && depthAbove == 0)
      //  return getDefaultKeyBinding(e);


      if(textAbove == "" || currentText == ""){
        maxDepth = Math.min(blockAbove.getDepth() + 1, maxDepth);
        const withAdjustment = adjustBlockDepthForContentState(
          content,
          selection,
          -1,
          maxDepth
        );

        const nextEditorState = EditorState.push(
          editorState,
          withAdjustment,
          'adjust-depth'
        );

        this.handleChange(nextEditorState);
        return "not-handle";
      }
    }
    return getDefaultKeyBinding(e);
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
    // Update single component
    const {selectedSlide, keyId, deckId} = this.props;

    if(selectedSlide.components && selectedSlide.components[keyId]){
      let component = selectedSlide.components[keyId];
      component.points = RTFMarkupString;
      component.rawContent = JSON.stringify(rawContent);

      let deckDataRef = firebase.database().ref('deckData/' + deckId + '/slides/' + selectedSlide.keyId + '/components/' + keyId);
      deckDataRef.set(component);
    }
  }

  onBulletToggleBlockType(type){
    if(!this.hasBlockType(type)){
      this._toggleBlockType(type)
    }
  }

  onBulletHandleKeyCommand(command){
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if(command == "backspace"){
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
    let numbered = [0, 0, 0, 0];

    if(isArray(blockArray)){
      points = map(blockArray, (block) => {
        const newContentState = ContentState.createFromBlockArray([block]);
        const newEditorState = EditorState.createWithContent(newContentState);
        const RTFMarkup = this.getRTFContent(newEditorState);
        const DOM = $.parseHTML(RTFMarkup);
        let htmlContent = block.text;
        if(DOM[0] && DOM[0].firstElementChild){
          htmlContent = DOM[0].firstElementChild.innerHTML;
        }
        let bulletType = "bulletPoint";
        const depth = block.getDepth();

        let blockData = {
          text: htmlContent,
          depth: depth
        };

        if(block.type == "ordered-list-item"){
          bulletType = "numeric";
          numbered[depth]= numbered[depth] + 1;
          blockData.value = numbered[depth];
        }

        blockData.type = bulletType;

        return blockData;
      });

      let i = 0, j = points.length - 1;

      for(j; j >= i; j--){
        const currentBlock = points[j];
        const parentObject = this.getParentBlock(points, currentBlock.depth, j);
        if(parentObject){
          const {parentBlock, parentIndex} = parentObject;
          if(!parentBlock.points)
            parentBlock.points = [];

          delete currentBlock.depth;
          parentBlock.points.unshift(currentBlock);
          points[parentIndex] = parentBlock;
        }
      }

      points = filter(points, (block) => {
        return block.depth == 0;
      });

      points = map(points, (block) => {
        delete block.depth;
        return block;
      })

    }
    return points;
  }

  _onTab(event: SyntheticKeyboardEvent) {
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

  componentDidUpdate(prevProps, prevState){
    if(JSON.stringify(prevProps.componentData) != JSON.stringify(this.props.componentData)){
      let editorState = this.getEditorState();
      this.setState({editorState: editorState});
    }

    if(prevState.editorState != this.state.editorState){
      if(!this.hasBlockType())
        this.toggleBlockType("unordered-list-item");
    }
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
                  keyBindingFn={this.myKeyBindingFn}
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

//BulletComponent.propTypes = {
//
//};

export default withRouter(BulletComponent, {withRef: true});