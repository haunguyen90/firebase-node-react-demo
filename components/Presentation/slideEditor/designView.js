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
    this.state = {
      playerInitialized: false,
      playerReady: false
    };

    window.PlayerInitialized = this.PlayerInitialized.bind(this);
    this.PlayerInitialized = this.PlayerInitialized.bind(this);
    window.PlayerReady = this.PlayerReady.bind(this);
    this.PlayerReady = this.PlayerReady.bind(this);
    window.PlayerShow = this.PlayerShow.bind(this);
    this.PlayerShow = this.PlayerShow.bind(this);
    window.PlayerLoadData = this.PlayerLoadData.bind(this);
    this.PlayerLoadData = this.PlayerLoadData.bind(this);
    window.PlayerSetSlide = this.PlayerSetSlide.bind(this);
    this.PlayerSetSlide = this.PlayerSetSlide.bind(this);
  }

  PlayerInitialized() {
    console.log("PlayerInitialized");
    this.setState({playerInitialized: true});
    this.PlayerLoadData();
  }

  PlayerReady() {
    console.log("PlayerReady");
    this.setState({playerReady: true});
    this.PlayerSetSlide(this.props.currentSlideIndex);
  }

  PlayerShow() {
    if (this.state.playerReady) {
      this.PlayerSetSlide(this);
    } else {
      this.PlayerLoadData();
    }
  }

  PlayerLoadData() {
    const {deckId} = this.props.deckObject.id;
    const curUser = firebase.auth().currentUser.uid;
    let deckDataExtend = {};
    Object.assign(deckDataExtend, this.props.deckData);
    deckDataExtend.slides.forEach((slide,index) => {
      slide.components.forEach((component, comIndex) => {
        if (component.type == "IMAGE"){
          let deckDataRef = firebase.database().ref('deckData/' + deckId + '/slides/' + index + '/components/' + comIndex);
          deckDataRef.on("value", (result) => {
            const newComponentData = result.val();
            if(newComponentData && newComponentData.assetId){
              let assetRef = firebase.database().ref('userAssets/' + newComponentData.assetId);
              assetRef.once("value").then( (result) => {
                if(result.val()){
                  getDownloadURL("images/" + curUser + "/" + result.val().fileName + "-" + curUser, (url) => {
                    if(url){
                      component.assertUrl = url;
                    };
                  });
                };
              });
            };
          });
        };
      });
    });

    let jsonMeta = JSON.stringify(this.props.deckObject);
    let jsonDeck = JSON.stringify(this.props.deckData);
    // test data
    if (jsonDeck == null) {
      jsonDeck = '{"slides":[{"components":[{"fontSize":"12pt","text":"Title for slide 2","type":"TITLE"},{"fontSize":"12pt","text":"","type":"TEXT"}],"keyId":1,"slideId":"-KS7joxL4-KAgC46vCzu","title":"Slide 2","type":"COMPONENT"},{"components":[{"fontSize":"12pt","text":"Title for slide 3","type":"TITLE"},{"fontSize":"12pt","text":"Text 1","type":"TEXT"},{"fontSize":"12pt","text":"Text 2","type":"TEXT"},{"fontSize":"12pt","text":"Text 3","type":"TEXT"}],"keyId":0,"slideId":"-KS7jp8aOmPJBpOwd6Op","title":"Slide 3","type":"COMPONENT"},{"components":[{"fontSize":"12pt","image":"https://firebasestorage.googleapis.com/v0/b/prezvr.appspot.com/o/images%2Fcar-showroom.png?alt=media&token=78e03419-c20a-4e00-a297-4695040d4b03","text":"Car Showroom","type":"IMAGE"}],"keyId":2,"slideId":"-KS6MrnRj-iGbK-hAJYh","title":"Slide 3","type":"COMPONENT"}]}';
    };
    // test data
    if (jsonMeta == null) {
      jsonMeta =  '{"cover":"https://firebasestorage.googleapis.com/v0/b/prezvr.appspot.com/o/images%2Fslide-cover2.png?alt=media&token=b7cc51db-b532-4ecc-91ee-da207c220798","description":"Demo presentation used for development purposes.","id":"KQyLJGyAKk0b45uaQEF","name":"VR Presentation for Testing","uid":"XXX"}';
    };
    //var jsonDeck = '{"slides":[{"components":[{"fontSize":"12pt","text":"Title for slide 2","type":"TITLE"},{"fontSize":"12pt","text":"","type":"TEXT"}],"keyId":1,"slideId":"-KS7joxL4-KAgC46vCzu","title":"Slide 2","type":"COMPONENT"}]}';
    console.log(jsonMeta);
    console.log(jsonDeck);
    SendMessage("Manager", "WebLoadMeta", jsonMeta);
    SendMessage("Manager", "WebLoadData", jsonDeck);
  }

  PlayerSetSlide(slideIndex) {
    if ( !this.state.playerInitialized || !this.state.playerReady) return;
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

    if(!window.Module)
      window.Module = Module;
  }

  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {

      }
      else this.props.onError()
    }
  }

  componentDidUpdate(prevProps, prevState){
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;
    const {playerInitialized, playerReady} = this.state;
    if (isScriptLoaded && isScriptLoadSucceed && playerInitialized) {
      const jsonMeta = JSON.stringify(this.props.deckObject);
      const jsonDeck = JSON.stringify(this.props.deckData);

      const prevJsonMeta = JSON.stringify(prevProps.deckObject);
      const prevJsonDeck = JSON.stringify(prevProps.deckData);

      if(jsonMeta != prevJsonMeta || jsonDeck != prevJsonDeck){
        PlayerLoadData();
      }

      if(prevProps.currentSlideIndex != this.props.currentSlideIndex){
        PlayerSetSlide(this.props.currentSlideIndex);
      }
    }
  }


  render(){
    let className = "";
    if(this.props.viewState == 1)
      className = "hide-design-view";
    return (
      <div className={"design-view-component " + className}>
        <div className="template-wrap clear">
          <canvas className="emscripten" id="canvas" onContextMenu={() => event.preventDefault()} height="600px" width="960px"></canvas>
          <br/>
          <div className="logo"></div>
        </div>
      </div>
    )
  }
}

DesignView.propTypes = {
  viewState: React.PropTypes.number,
  deckObject: React.PropTypes.object,
  deckData: React.PropTypes.object,
  currentSlideIndex: React.PropTypes.number
};

export default scriptLoader(
  '/Development/UnityLoader.js',
  '/TemplateData/UnityProgress.js'
  //'/Development/WebPlayer.js'
)(DesignView);
