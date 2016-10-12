/**
 * Created by hoadinh on 10/10/16.
 */
import React from 'react';
import {Modal, Row, Tabs, Tab} from 'react-bootstrap';

class AdjustModelModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
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

            </Row>
          </div>
        </Modal.Body>
      </Modal>

    )
  }
}

AdjustModelModal.propTypes = {
  showModal : React.PropTypes.bool,
  closeShareWindow : React.PropTypes.func
}

export default AdjustModelModal