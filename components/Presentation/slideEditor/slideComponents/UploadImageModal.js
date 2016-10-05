
import React from 'react';
import {Modal, Row, Tabs, Tab} from 'react-bootstrap';
import ImageUpload from './ImageUpload.js';
import ImageLibrary from  './ImageLibrary.js';

class UploadImageModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        imageUploadActiveTab : 1
    };
  }

  handleUploadImageTabSelect(key) {
    this.setState({imageUploadActiveTab: key});
  }

  render(){
    return  (
      <Modal show={this.props.showModal} onHide={this.props.closeShareWindow} className="uploadimage-modal">
        <Modal.Header closeButton>
          <Modal.Title>Add Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row className="uploadimage-body">
              <div>
                <Tabs id="uploadingImageTabs" activeKey={this.state.imageUploadActiveTab} onSelect={this.handleUploadImageTabSelect.bind(this)}>
                  <Tab eventKey={1} title="UPLOAD">
                    <ImageUpload {...this.props}
                            handleUploadImageTabSelect = {this.handleUploadImageTabSelect.bind(this)}/>
                  </Tab>
                  <Tab eventKey={2} title="LIBRARY">
                    <ImageLibrary {...this.props}/>
                  </Tab>
                </Tabs>
              </div>
            </Row>
          </div>
        </Modal.Body>
      </Modal>

    )
  }
}

UploadImageModal.propTypes = {
  showModal : React.PropTypes.bool,
  closeShareWindow : React.PropTypes.func
}

export default UploadImageModal
