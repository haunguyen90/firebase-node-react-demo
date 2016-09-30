/**
 * Created by haunguyen on 9/23/16.
 */
import React from 'react';
import {Editor, EditorState, RichUtils, convertFromRaw, convertToRaw, convertFromHTML, Modifier} from 'draft-js';
import {extend, each} from 'underscore';
import {stateToHTML} from 'draft-js-export-html';


import SlideComponent from '../slideComponents/SlideComponent.js';

class RichTextComponent extends SlideComponent {
  constructor(props) {
    super(props);

    this.handleBlur = () => {
      const {editorState} = this.state;
      this.onUpdateComponent(editorState);
    };

    this.handleChange = (editorState) => this._handleChange(editorState);
    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);

    this.convertToRaw = (editorState) => this._convertToRaw(editorState);
    this.convertFromRaw = (rawContent) => this._convertFromRaw(rawContent);
    this.onUpdateComponent = (editorState) => this.__onUpdateComponent(editorState);
    this._updateDatabase = this._updateDatabase.bind(this);
    this.getEditorState = this.getEditorState.bind(this);

    let editorState = this.getEditorState();

    this.state = extend({
      editorState: editorState
    }, this.state);

  }

  __onUpdateComponent(editorState) {
    if(!editorState)
      editorState = this.state.editorState;
    const RTFMarkup = this.getRTFContent(editorState);
    const rawContent = this.convertToRaw(editorState);
    this._updateDatabase(RTFMarkup, rawContent);

  }

  _updateDatabase(RTFMarkup, rawContent){
    // Update single component
    const {selectedSlide, keyId, deckId} = this.props;

    if(selectedSlide.components && selectedSlide.components[keyId]){
      let component = selectedSlide.components[keyId];
      component.text = RTFMarkup;
      component.rawContent = JSON.stringify(rawContent);

      let deckDataRef = firebase.database().ref('deckData/' + deckId + '/slides/' + selectedSlide.keyId + '/components/' + keyId);
      deckDataRef.set(component);
    }
  }

  _handleChange(editorState){
    this.setState({editorState: editorState});
  }

  _convertToRaw(editorState){
    if(!editorState)
      editorState = this.state.editorState;
    const rawContent = convertToRaw(editorState.getCurrentContent());
    return rawContent;
  }

  _convertFromRaw(rawContent){
    const contentState = convertFromRaw(rawContent);
    return contentState;
  }

  convertFromHTML(html){
    return convertFromHTML(html);
  }

  getEditorStateFromRaw(contentState){
    const editorState = EditorState.createWithContent(contentState);
    return editorState;
  }

  getEditorState(){
    let editorState = EditorState.createEmpty();
    if(this.props.componentData && this.props.componentData.rawContent){
      let rawContent;
      try{
        rawContent = JSON.parse(this.props.componentData.rawContent)
      }catch(e){
        console.warn("rawContent JSON is not valid");
      }
      if(rawContent){
        const contentState = this.convertFromRaw(rawContent);
        editorState = this.getEditorStateFromRaw(contentState);
      }
    }
    return editorState;
  }

  getRTFContent(editorState){
    let options = {
      inlineStyles: {
        // Override default element (`strong`).
        BOLD: {element: 'b'},
        ITALIC: {
          // Add custom attributes. You can also use React-style `className`.
          //attributes: {class: 'foo'},
          // Use camel-case. Units (`px`) will be added where necessary.
          //style: {fontSize: 12}
        },
        // Use a custom inline style. Default element is `span`.
        font1: {style: {"fontSize": '1em'}},
        font2: {style: {"fontSize": '1.2em'}},
        font3: {style: {"fontSize": '1.4em'}},
        font4: {style: {"fontSize": '1.6em'}},
        font5: {style: {"fontSize": '1.8em'}},
        font6: {style: {"fontSize": '2em'}},
        font7: {style: {"fontSize": '2.2em'}},
        font8: {style: {"fontSize": '2.4em'}},
        font9: {style: {"fontSize": '2.6pem'}},
        font10: {style: {"fontSize": '2.8em'}},
        font11: {style: {"fontSize": '3em'}},
        font12: {style: {"fontSize": '3.2em'}},
        font13: {style: {"fontSize": '3.4em'}},
        font14: {style: {"fontSize": '3.6em'}}
      }
    };

    if(!editorState)
      editorState = this.state.editorState;

    let html = stateToHTML(editorState.getCurrentContent(), options);
    html = html.replace(/<\/?p[^>]*>/g, "");
    return html;
  }

  _handleKeyCommand(command){
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.handleChange(newState);
      return true;
    }
    return false;
  }

  _toggleBlockType(blockType) {
    this.handleChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    const {customStyleMap} = this.props;
    const fontSizeKeys = Object.keys(customStyleMap);

    if(fontSizeKeys.indexOf(inlineStyle) > -1){
      const {editorState} = this.state;
      const selection = editorState.getSelection();

      // Let's just allow one font size at a time. Turn off all active font-size.
      const nextContentState = fontSizeKeys
        .reduce((contentState, fontSize) => {
          return Modifier.removeInlineStyle(contentState, selection, fontSize)
        }, editorState.getCurrentContent());

      let nextEditorState = EditorState.push(
        editorState,
        nextContentState,
        'change-inline-style'
      );

      const currentStyle = editorState.getCurrentInlineStyle();

      // Unset style override for current color.
      if (selection.isCollapsed()) {
        nextEditorState = currentStyle.reduce((state, color) => {
          return RichUtils.toggleInlineStyle(state, color);
        }, nextEditorState);
      }

      // If the color is being toggled on, apply it.
      if (!currentStyle.has(inlineStyle)) {
        nextEditorState = RichUtils.toggleInlineStyle(
          nextEditorState,
          inlineStyle
        );
      }

      this.handleChange(nextEditorState);
      this.onUpdateComponent(nextEditorState);

    }else {
      this.handleChange(
        RichUtils.toggleInlineStyle(
          this.state.editorState,
          inlineStyle
        )
      );
    }

  }

  renderBlockType(){
    const {editorState} = this.state;
    return (
      <BlockStyleControls
        editorState={editorState}
        onToggle={this.toggleBlockType}
        BLOCK_TYPES={this.props.BLOCK_TYPES}
      />
    )
  }

  renderInlineStyle(){
    const {editorState} = this.state;
    return (
      <InlineStyleControls
        editorState={editorState}
        onToggle={this.toggleInlineStyle}
        INLINE_STYLES={this.props.INLINE_STYLES}
      />
    )
  }

}

RichTextComponent.defaultProps = {
  BLOCK_TYPES: [
    //{label: 'H1', style: 'header-one'},
    //{label: 'H2', style: 'header-two'},
    //{label: 'H3', style: 'header-three'},
    //{label: 'H4', style: 'header-four'},
    //{label: 'H5', style: 'header-five'},
    //{label: 'H6', style: 'header-six'},
    //{label: 'Blockquote', style: 'blockquote'},
    {label: "UL", style: 'unordered-list-item'},
    {label: "OL", style: 'ordered-list-item'}
    //{label: 'Code Block', style: 'code-block'}
  ],
  INLINE_STYLES: [
    {label: 'B', style: 'BOLD'},
    {label: 'I', style: 'ITALIC'},
    {label: 'Font size', style: 'fontSize', sizes: [
      "font1", "font2", "font3", "font4", "font5", "font6", "font7",
      "font8", "font9", "font10", "font11", "font12", "font13", "font14"
    ]}
  ],
  customStyleMap: {
    font1: {
      "fontSize": "1em"
    },
    font2: {
      "fontSize": "1.2em"
    },
    font3: {
      "fontSize": "1.4em"
    },
    font4: {
      "fontSize": "1.6em"
    },
    font5: {
      "fontSize": "1.8em"
    },
    font6: {
      "fontSize": "2em"
    },
    font7: {
      "fontSize": "2.2em"
    },
    font8: {
      "fontSize": "2.4em"
    },
    font9: {
      "fontSize": "2.6em"
    },
    font10: {
      "fontSize": "2.8em"
    },
    font11: {
      "fontSize": "3em"
    },
    font12: {
      "fontSize": "3.2em"
    },
    font13: {
      "fontSize": "3.4em"
    },
    font14: {
      "fontSize": "3.6em"
    }
  },
  defaultStyles: {

  }
};

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  renderButtonLabel(){
    if(this.props.label == "UL"){
      return (
        <i className="fa fa-list-ul"></i>
      );
    }else if(this.props.label == "OL"){
      return (<i className="fa fa-list-ol"></i>)
    }else{
      return this.props.label;
    }
  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.renderButtonLabel()}
      </span>
    );
  }
}

class FontSizeSelect extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      // Deprecated
      console.warn("This function is deprecated. Please use onChangeSize");
      e.preventDefault();
      const style = e.target.value;
      this.props.onToggle(style);
    };

    this.onChangeSize = (action, e) => {
      e.preventDefault();
      const {active} = this.state;
      const pattern = /^font/i;
      if(active && pattern.test(active)){
        let size = parseInt(active.slice(4));
        if(action == "up"){
          size++;
        }else{
          size--;
        }
        if(size < 1 || size > 14)
          return;

        const newStyle = `${active.slice(0, 4)}${size}`;
        this.props.onToggle(newStyle);
        this.updateSelectBox(newStyle);
      }else{
        if(action == "up"){
          const newStyle = 'font2';
          this.props.onToggle(newStyle);
          this.updateSelectBox(newStyle);
        }
      }
    };

    this.state = {
      active: ""
    };
  }

  updateSelectBox(size){
    this.setState({active: size});
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.currentSelection.getStartOffset() != this.props.currentSelection.getStartOffset()){
      each(this.props.fontSizeArray, (size) => {
        if(this.props.currentStyle.get(size)){
          this.updateSelectBox(size);
        }
      });

    }
  }

  render(){
    return (
      <span className="fontSize-root">
        <span className="RichEditor-styleButton" onMouseDown={this.onChangeSize.bind(this, "down")}>Text-</span>
        <span className="RichEditor-styleButton" onMouseDown={this.onChangeSize.bind(this, "up")}>Text+</span>
      </span>
    )
  }

  renderTest() {
    return (
      <select name="fontSize" onChange={this.onToggle} value={this.state.active}>
        {this.props.fontSizeArray.map((size, index) => {

          return (
            <option key={index} value={size}>{size}</option>
          )
        })}
      </select>
    );
  }
}

const BlockStyleControls = (props) => {
  const {editorState, BLOCK_TYPES} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
          <StyleButton
            key={type.label}
            active={type.style === blockType}
            label={type.label}
            onToggle={props.onToggle}
            style={type.style}
          />
      )}
    </div>
  );
};

const InlineStyleControls = (props) => {
  let currentStyle = props.editorState.getCurrentInlineStyle();
  let currentSelection = props.editorState.getSelection();
  const {INLINE_STYLES} = props;
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map( (type) => {
        if(type.style == "fontSize"){
          return (
            <FontSizeSelect
              key={type.label}
              fontSizeArray={type.sizes}
              onToggle={props.onToggle}
              currentSelection={currentSelection}
              currentStyle={currentStyle}
            />
          )
        }else{
          return (
            <StyleButton
              key={type.label}
              active={currentStyle.has(type.style)}
              label={type.label}
              onToggle={props.onToggle}
              style={type.style}
            />
          )
        }

      })}
    </div>
  );
};

export default RichTextComponent;