import React from 'react';
import { Col, Thumbnail} from 'react-bootstrap';
import {getDownloadURL} from '~/lib/firebaseHelpers/storageHelper.js';

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
    getDownloadURL("images/" + uid + "/" + userAsset.fileName + "-" + uid, this.getURLCallBack);
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
          href="#" alt="171x180" src={imageURL}/>
      </Col>
    )
  }
}

export default ThumbnailImage