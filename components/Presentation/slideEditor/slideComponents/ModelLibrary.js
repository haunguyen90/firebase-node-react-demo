/**
 * Created by hoadinh on 10/10/16.
 */
import React from 'react';
import {Row, Col, Thumbnail, Button} from 'react-bootstrap';
import {map, findIndex, isObject} from 'underscore';
import {getDownloadURL} from '~/lib/firebaseHelpers/storageHelper.js';
import ThumbnailImage from './ThumbnailImage.js';
import AdjustModelModal from './AdjustModelModal.js'


class ModelLibrary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userModels : [],
      selectedModel : null,
      imageURL : "",
      showModal: false
    }

    this.chooseModel = this.chooseModel.bind(this);
    this.getUserLibrary = this.getUserLibrary.bind(this);
    this.onSelectModel = this.onSelectModel.bind(this);
  }

  getUserLibrary() {
    const assetRef = firebase.database().ref('userAssets');
    const uid = firebase.auth().currentUser.uid;
    assetRef
    .orderByChild("uid")
    .startAt(uid).endAt(uid)
    .on("value", (data) => {
      const userAssets = data.val();
      if(isObject(userAssets)){
        const userModels = map(Object.keys(userAssets), (assetsId) => {
          let assetsObject = userAssets[assetsId];
          if (assetsObject.type == "OBJECT"){
            assetsObject.id = assetsId;
            return assetsObject;
          }
        });
        this.setState({userModels : userModels});
      }
    });
  }

  componentDidMount() {
    this.getUserLibrary();
  }

  onSelectModel(assetsId, e) {
    e.preventDefault();
    this.setState({selectedModel : assetsId});
  }

  closeShareWindow() {
    this.setState({ showModal : false});
  }

  showAdjustModelModal(e) {
    e.preventDefault();
    this.setState({ showModal : true});
  }

  chooseModel() {
    const {selectedSlide, keyId, deckId, getSlides} = this.props;
    const {selectedModel} = this.state;
    if (!selectedModel) {
      return
    }
    if(selectedSlide.components && selectedSlide.components[keyId]){
      const slides = getSlides();
      const currentSlideIndex = findIndex(slides, (slide) => {
        return slide.slideId == selectedSlide.slideId
      });

      if(currentSlideIndex >= 0){
        // Assign new upload image asset to image component
        let component = selectedSlide.components[keyId];
        component.assetId = selectedModel;
        let deckDataRef = firebase.database().ref('deckData/' + deckId + '/slides/' + currentSlideIndex + '/components/' + keyId);
        deckDataRef.set(component);
        this.props.closeShareWindow();
      }
    }


  }
  render() {
    return (
      <div>
        <Row className="library-images-list">
          {this.state.userModels.map((userModel, index) => {
            if (!userModel) { return null; };
            let activeImageClass = "";
            if(userModel.id == this.state.selectedModel){
              activeImageClass = "selected-image";
            }

            return (
              <ThumbnailImage
                activeImageClass={activeImageClass}
                onSelectImage={this.onSelectModel}
                userAsset={userModel} key={index}/>
            )
          })}


        </Row>
        <Row>
          { this.state.selectedModel ?
          <Col xs={12} mdPull={3} className="adjust-text">
            <a href="#" onClick={this.showAdjustModelModal.bind(this)}>Adjust model</a>
          </Col> : null }
          <Col xs={9} xs={12} mdPush={3} md={9} className="button-wrapper">
            <Button
              disabled={!this.state.selectedModel}
              onClick= {this.chooseModel}
              >Add model</Button>
          </Col>
        </Row>
        <AdjustModelModal showModal={this.state.showModal}
        closeShareWindow={this.closeShareWindow.bind(this)}/>
      </div>
    )
  }
}

ModelLibrary.propTypes = {
  selectedSlide : React.PropTypes.object,
  keyId : React.PropTypes.number,
  deckId : React.PropTypes.string,
  getSlides : React.PropTypes.func,
  closeShareWindow : React.PropTypes.func
}

export default ModelLibrary;
