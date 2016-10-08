/**
 * Created by haunguyen on 9/15/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Thumbnail, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import {extend, findIndex} from 'underscore';
import {isMounted} from '~/lib/react/reactLib.js';
import { Circle } from 'rc-progress';
import {ENUMS} from '~/lib/_required/enums.js';
import Confirm from 'react-confirm-bootstrap';

import SlideComponent from './SlideComponent.js';
import UploadImageModal from './UploadImageModal.js';
import {getDownloadURL} from '~/lib/firebaseHelpers/storageHelper.js';

class ImageComponent extends SlideComponent {
  constructor(props){
    super(props);

    let captionText = "";
    if(props.componentData && props.componentData.text)
      captionText = props.componentData.text;

    this.state = extend({
      text: captionText,
      showModal: false,
      imageURL: ENUMS.MISC.NO_IMAGE_AVAILABLE
    }, this.state);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleChange(event){
    event.preventDefault();
    const value = event.target.value;
    this.setState({text: value});
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.selectedSlide && prevProps.selectedSlide.slideId != this.props.selectedSlide.slideId){
      const {deckId, selectedSlide, keyId, getSlides} = this.props;
      const prevSelectedSlide = prevProps.selectedSlide;
      const slides = getSlides();
      const currentSlideIndex = findIndex(slides, (slide) => {
        return slide.slideId == selectedSlide.slideId
      });

      const prevSlideIndex = findIndex(slides, (slide) => {
        return slide.slideId == prevSelectedSlide.slideId
      });
      const curUser = firebase.auth().currentUser.uid;

      let deckDataRef = firebase.database().ref('deckData/' + deckId + '/slides/' + currentSlideIndex + '/components/' + keyId);
      let prevDeckDataRef = firebase.database().ref('deckData/' + deckId + '/slides/' + prevSlideIndex + '/components/' + keyId);
      prevDeckDataRef.off();

      if(isMounted(this)) {
        deckDataRef.on("value", (result) => {
          const newComponentData = result.val();
          if(newComponentData && newComponentData.assetId){
            let assetRef = firebase.database().ref('userAssets/' + newComponentData.assetId);

            assetRef.once("value").then( (result) => {
              if(result.val()){
                getDownloadURL("images/" + curUser + "/" + result.val().fileName + "-" + curUser, (url) => {
                  if(url)
                    this.setState({imageURL: url});
                  else
                    this.setState({imageURL: ENUMS.MISC.NO_IMAGE_AVAILABLE});
                });
              }
            });
          }

        });
      }

    }

    if(JSON.stringify(prevProps.componentData) != JSON.stringify(this.props.componentData)){
      if(this.props.componentData.text != prevProps.componentData.text)
        this.setState({text: this.props.componentData.text});
    }
  }

  componentDidMount() {
    const {componentData, deckId, selectedSlide, keyId, getSlides} = this.props;
    const slides = getSlides();
    const currentSlideIndex = findIndex(slides, (slide) => {
      return slide.slideId == selectedSlide.slideId
    });
    const curUser = firebase.auth().currentUser.uid;
    if(isMounted(this)) {
      let deckDataRef = firebase.database().ref('deckData/' + deckId + '/slides/' + currentSlideIndex + '/components/' + keyId);
      deckDataRef.on("value", (result) => {
        const newComponentData = result.val();
        if(newComponentData && newComponentData.assetId){
          let assetRef = firebase.database().ref('userAssets/' + newComponentData.assetId);

          assetRef.once("value").then( (result) => {
            if(result.val()){
              getDownloadURL("images/" + curUser + "/" + result.val().fileName + "-" + curUser, (url) => {
                if(url)
                  this.setState({imageURL: url});
                else
                  this.setState({imageURL: ENUMS.MISC.NO_IMAGE_AVAILABLE});
              });
            }
          });
        }

      });
    }
  }

  componentWillUnmount() {
    const {deckId, selectedSlide, keyId, getSlides} = this.props;
    const slides = getSlides();
    const currentSlideIndex = findIndex(slides, (slide) => {
      return slide.slideId == selectedSlide.slideId
    });
    let deckDataRef = firebase.database().ref('deckData/' + deckId + '/slides/' + currentSlideIndex + '/components/' + keyId);
    deckDataRef.off();
  }

  showImageModal() {
    this.setState({ showModal : true});
  }

  closeShareWindow() {
    this.setState({ showModal : false});
  }

  render(){
    const {keyId} = this.props;
    const {text, isUploading, uploadPercent} = this.state;


    return (
      <div className="slide-component image-component row">
        <Col sm={2}>
          <FormGroup controlId={"componentImagePic-" + keyId}>
            <ControlLabel>IMAGE</ControlLabel>
            <Thumbnail className="image-thumbnail" href="#" alt="171x180" src={this.state.imageURL} />
            <div className="box__input">
              <Button className="uploadButton" bsStyle="primary" onClick={this.showImageModal.bind(this)} block>
                <label className="fileInputLabel">
                  <i className="fa fa-upload"></i>
                  <span className="label-text">UPLOAD</span>
                </label>
              </Button>
            </div>
          </FormGroup>
        </Col>

        <Col sm={10}>
          <FormGroup controlId={"componentImageText-" + keyId}>
            <Confirm
              onConfirm={this.onRemoveComponent}
              body="Are you sure you want to remove this component?"
              confirmText="Confirm Delete"
              title={"Deleting Component"}>
              <a href="#" className="remove-component">Remove</a>
            </Confirm>

            <FormControl
              componentClass="textarea"
              className="caption-area"
              placeholder="caption"
              value={text}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
            />
            <FormControl.Feedback />
          </FormGroup>
        </Col>
        <UploadImageModal
          showModal={this.state.showModal}
          closeShareWindow={this.closeShareWindow.bind(this)}
          {...this.props}
        />


      </div>
    )
  }
}

ImageComponent.propTypes = {
  handleAlertShow: React.PropTypes.func
};

export default withRouter(ImageComponent, {withRef: true});
