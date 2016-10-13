import React from 'react';
import { Col, Thumbnail} from 'react-bootstrap';
import {getDownloadURL} from '~/lib/firebaseHelpers/storageHelper.js';
import {ENUMS} from '~/lib/_required/enums.js';

class ThumbnailImage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      imageURL : null
    };

    this.getURLCallBack = this.getURLCallBack.bind(this);
    this.getDownloadImageURL = this.getDownloadImageURL.bind(this);
    this.onSelectImage = this.onSelectImage.bind(this);
  }

  getURLCallBack (url) {
    this.setState({imageURL : url}) ;
  }

  getDownloadImageURL() {
    const {userAsset} = this.props;
    const uid = firebase.auth().currentUser.uid;
    if (userAsset.type === "IMAGE") {
      getDownloadURL("images/" + uid + "/" + userAsset.fileName + "-" + uid, this.getURLCallBack);
    } else {
      this.setState({imageURL : ENUMS.MISC.NO_IMAGE_AVAILABLE}) ;
    }
  }

  componentDidMount(){
    this.getDownloadImageURL();
  }

  onSelectImage(e){
    const {userAsset} = this.props;
    this.props.onSelectImage(userAsset.id, e);
  }

  render () {
    const {imageURL} = this.state;
    const {activeImageClass} = this.props;
    return (
      <Col xs={3} md={3} >
        <Thumbnail className={activeImageClass}
          onClick={this.onSelectImage}
          href="#" alt="171x180"
          src={imageURL}/>
        {this.props.userAsset.type === "OBJECT" ? <p>{this.props.userAsset.fileName}</p> : null}
      </Col>
    )
  }
}

export default ThumbnailImage
