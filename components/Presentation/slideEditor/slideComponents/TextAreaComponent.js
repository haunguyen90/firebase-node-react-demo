/**
 * Created by haunguyen on 9/15/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Thumbnail, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import {extend} from 'underscore';
import ReactDOM from 'react-dom';
import {Editor, EditorState} from 'draft-js';

import RichTextComponent from '../richText/richTextComponent.js';

class TextAreaComponent extends RichTextComponent {
  constructor(props){
    super(props);

    this.state = extend({}, this.state);
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

    //this.toggleInlineStyle("font14");
  }

  render(){
    const {keyId} = this.props;
    const {editorState} = this.state;

    return (
      <div className="slide-component textarea-component row">
        <Col sm={12}>
          <FormGroup controlId={"componentTextArea-" + keyId}>
            <ControlLabel>TEXT</ControlLabel>
            {this.renderConfirmDeleteComponent()}

            <div className="RichEditor-root">
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

//TextAreaComponent.propTypes = {
//
//};

export default withRouter(TextAreaComponent, {withRef: true});