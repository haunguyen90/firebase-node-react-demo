/**
 * Created by haunguyen on 9/11/16.
 */
import React from 'react';
import {withRouter} from 'react-router';
import {PageHeader, Grid, Row, Col, Button, Modal} from 'react-bootstrap';
import {CONST} from '~/lib/_required/enums.js';
import { FacebookButton, FacebookCount } from "react-social";

class NewFaceBookButton extends FacebookButton {
  constructor(props) {
    super(props);
    this.constructUrl = this.newConstructUrl.bind(this);
  }
  newConstructUrl(){
    console.log(this.props.url);
    return "https://www.facebook.com/dialog/share?"
      + "app_id=145634995501895"
      + "&display=popup"
      + "&href=" + encodeURIComponent(this.props.url)
      + "&redirect_uri=" + encodeURIComponent("https://developers.facebook.com/tools/explorer");
  }
}

class SharingDeckModal extends React.Component {
  constructor (props) {
    super(props);
    this.state = {}
  }

  facebookClick(socialEvent, url, target){
    console.log(socialEvent);
    window.open(url, 'name', 'width=600,height=400');
  }

  render() {
    const {deckUrl} = this.props;
    return (
      <Modal className="sharing-deck-modal-component"
             show={this.props.showModal}
             onHide={this.props.closeShareWindow}>
        <Modal.Header closeButton>
          <Modal.Title>Share Presentation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid>
            <Row className="link-wrapper">
              <div className="click-to-copy-link">
                <span>Click to copy link</span>
              </div>
              <Col xs={12} className="link-display">
                <span>{deckUrl}</span>
              </Col>
            </Row>
            <Row className="share-action">
              <NewFaceBookButton
                className="btn btn-social-icon btn-facebook"
                url={deckUrl}
                appId={CONST.APP.SOCIAL_SETTINGS.FACEBOOK.APP_ID}
                target={"popup"}
                _open={false}
                onClick={this.facebookClick.bind(this)}
              >
                <i className="fa fa-facebook"></i>
              </NewFaceBookButton>
            </Row>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeShareWindow}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

SharingDeckModal.propTypes = {
  deckUrl: React.PropTypes.string,
  showModal: React.PropTypes.bool,
  closeShareWindow: React.PropTypes.func
};

export default withRouter(SharingDeckModal);