/**
 * Created by haunguyen on 9/15/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import scriptLoader from 'react-async-script-loader'

class DesignView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.playerInitialized = false;
    this.playerReady = false;
  }

  PlayerInitialized(){
    console.log("PlayerInitialized");
    this.playerInitialized = true;
    this.PlayerLoadData();
  }

  PlayerReady(){
    console.log("PlayerReady");
    this.playerReady = true;
    this.PlayerSetSlide(2);
  }

  PlayerShow(){
    if (this.playerReady) {
      this.PlayerSetSlide(0);
    } else {
      this.PlayerLoadData();
    }
  }

  PlayerLoadData(jsonMeta=null, jsonDeck=null) {

    // test data
    if (jsonDeck == null) jsonDeck = '{"slides":[{"components":[{"fontSize":"12pt","text":"Title for slide 2","type":"TITLE"},{"fontSize":"12pt","text":"","type":"TEXT"}],"keyId":1,"slideId":"-KS7joxL4-KAgC46vCzu","title":"Slide 2","type":"COMPONENT"},{"components":[{"fontSize":"12pt","text":"Title for slide 3","type":"TITLE"},{"fontSize":"12pt","text":"Text 1","type":"TEXT"},{"fontSize":"12pt","text":"Text 2","type":"TEXT"},{"fontSize":"12pt","text":"Text 3","type":"TEXT"}],"keyId":0,"slideId":"-KS7jp8aOmPJBpOwd6Op","title":"Slide 3","type":"COMPONENT"},{"components":[{"fontSize":"12pt","image":"https://firebasestorage.googleapis.com/v0/b/prezvr.appspot.com/o/images%2Fcar-showroom.png?alt=media&token=78e03419-c20a-4e00-a297-4695040d4b03","text":"Car Showroom","type":"IMAGE"}],"keyId":2,"slideId":"-KS6MrnRj-iGbK-hAJYh","title":"Slide 3","type":"COMPONENT"}]}';

    // test data
    if (jsonMeta == null) jsonMeta =  '{"cover":"https://firebasestorage.googleapis.com/v0/b/prezvr.appspot.com/o/images%2Fslide-cover2.png?alt=media&token=b7cc51db-b532-4ecc-91ee-da207c220798","description":"Demo presentation used for development purposes.","id":"KQyLJGyAKk0b45uaQEF","name":"VR Presentation for Testing","uid":"XXX"}';
    //var jsonDeck = '{"slides":[{"components":[{"fontSize":"12pt","text":"Title for slide 2","type":"TITLE"},{"fontSize":"12pt","text":"","type":"TEXT"}],"keyId":1,"slideId":"-KS7joxL4-KAgC46vCzu","title":"Slide 2","type":"COMPONENT"}]}';

    SendMessage("Manager", "WebLoadMeta", jsonMeta);
    SendMessage("Manager", "WebLoadData", jsonDeck);
  }

  PlayerSetSlide(slideIndex) {
    if ( !this.playerInitialized || !this.playerReady) return;
    SendMessage("Manager", "WebShowSlide", slideIndex);
  }

  componentWillMount(){
    let Module = {
      TOTAL_MEMORY: 536870912,
      errorhandler: null,			// arguments: err, url, line. This function must return 'true' if the error is handled, otherwise 'false'
      compatibilitycheck: null,
      dataUrl: "/Development/prezentvrweb.data",
      codeUrl: "/Development/prezentvrweb.js",
      memUrl: "/Development/prezentvrweb.mem"

    };
    window.Module = Module;
  }

  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {
        console.log("loaded script");
      }
      else this.props.onError()
    }
  }

  componentDidMount(){
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;
    if (isScriptLoaded && isScriptLoadSucceed) {
      console.log("Play show here");
      //this.PlayerShow();
    }
  }

  render(){
    return (
      <div className="design-view-component">
        <div className="template-wrap clear">
          <canvas className="emscripten" id="canvas" oncontextmenu="event.preventDefault()" height="600px" width="960px"></canvas>
          <br/>
          <div className="logo"></div>
        </div>
      </div>
    )
  }
}

export default scriptLoader(
  '/Development/UnityLoader.js',
  '/TemplateData/UnityProgress.js',
  '/Development/WebPlayer.js'
)(DesignView);