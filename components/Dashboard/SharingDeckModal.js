/**
 * Created by haunguyen on 9/11/16.
 */
import React from 'react';
import {withRouter} from 'react-router';
import {PageHeader, Grid, Row, Col, Button, Modal} from 'react-bootstrap';
import {CONST} from '~/lib/_required/enums.js';
import { FacebookButton, FacebookCount, TwitterButton, GooglePlusButton } from "react-social";
import CopyToClipboard from 'react-copy-to-clipboard';

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
      + "&quote=" + encodeURIComponent(this.props.message)
      + "&href=" + encodeURIComponent(this.props.url)
      + "&redirect_uri=" + encodeURIComponent("https://developers.facebook.com/tools/explorer");
  }
}

class SharingDeckModal extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      copied: false
    }
  }

  socialClick(socialEvent, url, target){
    console.log(socialEvent);
    window.open(url, 'name', 'width=600,height=400');
  }

  onCopy(){
    this.setState({copied: true});
    setTimeout(() => {
      this.setState({copied: false});
    }, 350)
  }

  render() {
    const {deckUrl, name} = this.props;
    return (
      <Modal className="sharing-deck-modal-component"
             show={this.props.showModal}
             onHide={this.props.closeShareWindow}>
        <Modal.Header closeButton>
          <Modal.Title>Share Presentation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row className="link-wrapper">
              <div className="click-to-copy-link">
                  <span>Click to copy</span>
                {this.state.copied?
                  <span className="copied-text-alert text-danger">Copied</span> : null
                }
              </div>
              <CopyToClipboard text={deckUrl}
                               onCopy={this.onCopy.bind(this)}>
                <Col xs={12} className="link-display">
                  <span>{deckUrl}</span>
                </Col>
              </CopyToClipboard>
            </Row>
            <Row className="share-action">
              <NewFaceBookButton
                className="btn btn-social-icon btn-facebook"
                url={deckUrl}
                appId={CONST.APP.SOCIAL_SETTINGS.FACEBOOK.APP_ID}
                target={"popup"}
                _open={false}
                message={name + " " + deckUrl}
                onClick={this.socialClick.bind(this)}
                >
                <i className="fa fa-facebook"></i>
              </NewFaceBookButton>

              <TwitterButton
                className="btn btn-social-icon btn-twitter"
                url={deckUrl}
                target={"popup"}
                _open={false}
                message={name}
                onClick={this.socialClick.bind(this)}
                >
                <i className="fa fa-twitter"></i>
              </TwitterButton>

              <GooglePlusButton
                className="btn btn-social-icon btn-google"
                url={deckUrl}
                target={"popup"}
                _open={false}
                onClick={this.socialClick.bind(this)}
                >
                <i className="fa fa-google"></i>
              </GooglePlusButton>
            </Row>
          </div>
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
