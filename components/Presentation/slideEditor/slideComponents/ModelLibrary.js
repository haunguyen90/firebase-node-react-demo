/**
 * Created by hoadinh on 10/10/16.
 */
import React from 'react';
import {Row, Col, Thumbnail, Button} from 'react-bootstrap';
import {map, findIndex, isObject} from 'underscore';
import {getDownloadURL} from '~/lib/firebaseHelpers/storageHelper.js';
import ThumbnailImage from './ThumbnailImage.js';


class ModelLibrary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userImages : [],
      selectedImage : null,
      imageURL : ""
    }

    this.chooseImage = this.chooseImage.bind(this);
    this.getUserLibrary = this.getUserLibrary.bind(this);
    this.onSelectImage = this.onSelectImage.bind(this);
  }

  getUserLibrary() {
    const assetRef = firebase.database().ref('userAssets');
    const uid = firebase.auth().currentUser.uid;
    assetRef.orderByChild("uid").equalTo(uid)
    .on("value", (data) => {
      const userAssets = data.val();
      if(isObject(userAssets)){
        const userImages = map(Object.keys(userAssets), (assetsId) => {
          let assetsObject = userAssets[assetsId];
          assetsObject.id = assetsId;
          return assetsObject;
        });
        this.setState({userImages : userImages});
      }
    });
  }

  componentDidMount() {
    this.getUserLibrary();
  }

  onSelectImage(assetsId, e) {
    e.preventDefault();
    this.setState({selectedImage : assetsId});
  }

  chooseImage() {
    const {selectedSlide, keyId, deckId, getSlides} = this.props;
    const {selectedImage} = this.state;
    if (!selectedImage) {
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
        component.assetId = selectedImage;
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
          {this.state.userImages.map((userImage, index) => {
            let activeImageClass = "";
            if(userImage.id == this.state.selectedImage){
              activeImageClass = "selected-image";
            }

            return (
              <ThumbnailImage
                activeImageClass={activeImageClass}
                onSelectImage={this.onSelectImage}
                userAsset={userImage} key={index}/>
            )
          })}


        </Row>
        <Row>
          <Col xs={12} className="button-wrapper">
            <Button
              disabled={!this.state.selectedImage}
              onClick= {this.chooseImage}
              >Add image</Button>
          </Col>
        </Row>
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
