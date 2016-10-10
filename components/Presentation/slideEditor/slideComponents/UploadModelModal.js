/**
 * Created by hoadinh on 10/10/16.
 */
import React from 'react';
import {Modal, Row, Tabs, Tab} from 'react-bootstrap';
import ModelUpload from './ModelUpload.js';
import ModelLibrary from  './ModelLibrary.js';

class UploadModelModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        modelUploadActiveTab : 1
    };
  }

  handleUploadModelTabSelect(key) {
    this.setState({modelUploadActiveTab: key});
  }

  render(){
    return  (
      <Modal show={this.props.showModal} onHide={this.props.closeShareWindow} className="uploadmodel-modal">
        <Modal.Header closeButton>
          <Modal.Title>Add Model</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row className="uploadmodel-body">
              <div>
                <Tabs id="uploadingModelTabs" activeKey={this.state.modelUploadActiveTab} onSelect={this.handleUploadModelTabSelect.bind(this)}>
                  <Tab eventKey={1} title="UPLOAD">
                    <ModelUpload {...this.props}
                            handleUploadModelTabSelect = {this.handleUploadModelTabSelect.bind(this)}/>
                  </Tab>
                  <Tab eventKey={2} title="LIBRARY">
                    <ModelLibrary {...this.props}/>
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

UploadModelModal.propTypes = {
  showModal : React.PropTypes.bool,
  closeShareWindow : React.PropTypes.func
}

export default UploadModelModal
