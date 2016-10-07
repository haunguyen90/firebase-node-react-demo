import React from 'react';
import {Row, Col, Thumbnail, Button} from 'react-bootstrap';
import {map, findIndex, isObject} from 'underscore';


class ImageLibrary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userImages : [],
      selectedImage : null
    }

    this.chooseImage = this.chooseImage.bind(this);
  }

  getUserLibrary() {
    const assetRef = firebase.database().ref('userAssets');
    assetRef.orderByChild("uid").equalTo(firebase.auth().currentUser.uid)
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
            if(userImage.id == this.state.selectedImage)
              activeImageClass = "selected-image";
            return (
              <Col xs={3} md={3} key={index}>
                <Thumbnail className={activeImageClass} onClick={this.onSelectImage.bind(this, userImage.id)} href="#" alt="171x180" src={userImage.url}/>
              </Col>
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

ImageLibrary.propTypes = {
  selectedSlide : React.PropTypes.object,
  keyId : React.PropTypes.number,
  deckId : React.PropTypes.string,
  getSlides : React.PropTypes.func,
  closeShareWindow : React.PropTypes.func
}

export default ImageLibrary;
