/**
 * Created by haunguyen on 9/15/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Thumbnail, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import {extend} from 'underscore';
import Confirm from 'react-confirm-bootstrap';
import ReactDOM from 'react-dom';
import {Editor, EditorState, RichUtils} from 'draft-js';

import RichTextComponent from '../richText/richTextComponent.js';

class TextAreaComponent extends RichTextComponent {
  constructor(props){
    super(props);

    //let textArea = "";
    //if(props.componentData && props.componentData.text)
    //  textArea = props.componentData.text;

    let editorState = EditorState.createEmpty();
    if(props.componentData && props.componentData.rawContent){
      let rawContent;
      try{
        rawContent = JSON.parse(props.componentData.rawContent)
      }catch(e){
        console.warn("rawContent JSON is not valid");
      }
      if(rawContent){
        const contentState = this.convertFromRaw(rawContent);
        editorState = this.getEditorStateFromRaw(contentState);
      }
    }

    this.state = extend({
      editorState: editorState
    }, this.state);


    this.handleBlur = () => {
      const {editorState} = this.state;
      this.onUpdateComponent(editorState);
    };
    this.onRemoveComponent = this.onRemoveComponent.bind(this);
  }

  componentDidUpdate(prevProps, prevState){
    //if(JSON.stringify(prevProps.componentData) && JSON.stringify(this.props.componentData)){
    //  if(this.props.componentData.text != prevProps.componentData.text)
    //    this.setState({text: this.props.componentData.text});
    //}
  }

  componentDidMount(){
    //const textArea = ReactDOM.findDOMNode(this.refs.textComponentField);
    //const editor = new Squire( textArea , {
    //  blockTag: 'p',
    //  blockAttributes: {'class': 'paragraph'},
    //  tagAttributes: {
    //    ul: {'class': 'UL'},
    //    ol: {'class': 'OL'},
    //    li: {'class': 'listItem'},
    //    a: {'target': '_blank'}
    //  }
    //});
    //
    //console.log(editor);

    this.toggleInlineStyle("font14");
  }

  render(){
    const {componentData, keyId} = this.props;
    const {editorState} = this.state;

    return (
      <div className="slide-component textarea-component row">
        <Col sm={12}>
          <FormGroup controlId={"componentTextArea-" + keyId}>
            <ControlLabel>TEXT</ControlLabel>
            <Confirm
              onConfirm={this.onRemoveComponent}
              body="Are you sure you want to remove this component?"
              confirmText="Confirm Delete"
              title={"Deleting Component"}>
              <a href="#" className="remove-component">Remove</a>
            </Confirm>

            <div className="textarea-text form-control RichEditor-root">
              {this.renderInlineStyle()}
              <div className="RichEditor-editor">
                <Editor
                  customStyleMap={this.props.customStyleMap}
                  editorState={editorState}
                  handleKeyCommand={this.handleKeyCommand}
                  onChange={this.handleChange}
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

TextAreaComponent.propTypes = {
  keyId: React.PropTypes.number,
  componentData: React.PropTypes.object,
  deckId: React.PropTypes.string,
  selectedSlide: React.PropTypes.object
};

export default withRouter(TextAreaComponent, {withRef: true});