// Babel ES6/JSX Compiler
require('babel-register');
require("babel-polyfill");

var express = require('express');
var sassMiddleware = require('node-sass-middleware');
var path = require ('path');
var favicon = require ('serve-favicon');
var logger = require ('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var swig  = require('swig');

var browserify = require('browserify');
var literalify = require('literalify');
var babelify = require('babelify');

var routes = require('./routes/index.js');

var app = express();
app.use("/stylesheets", sassMiddleware({
  /* Options */
  src: __dirname + '/public/scss',
  dest: path.join(__dirname, 'public/stylesheets'),
  debug: true,
  outputStyle: 'compressed'
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/bundle.js', function(req, res, next) {
  res.setHeader('Content-Type', 'text/javascript');

  // Here we invoke browserify to package up browser.js and everything it requires.
  // DON'T do it on the fly like this in production - it's very costly -
  // either compile the bundle ahead of time, or use some smarter middleware
  // (eg browserify-middleware).
  // We also use literalify to transform our `require` statements for React
  // so that it uses the global variable (from the CDN JS file) instead of
  // bundling it up with everything else
  var dependencies = [
    'alt',
    'react',
    'react-dom',
    'react-router',
    'underscore'
  ];

  var production = process.env.NODE_ENV === 'production';

  //.transform(literalify.configure({
  //  'react': 'window.React',
  //  'react-dom': 'window.ReactDOM'
  //}))

  browserify('./main.js', {debug: true})
    .transform(babelify, { presets: ['es2015', 'react'] })
    .bundle()
    .pipe(res)

});

app.get('/deck/:id', function(req, res, next) {
  console.log('start');
  var deckId = req.params.id;
  var firebase = require('firebase');
  var gcloud = require('gcloud')({
    projectId: 'prezvr',
    keyFilename: './vincent-firebase.json'
  });
  var gcs = gcloud.storage();
  var bucket = gcs.bucket('prezvr.appspot.com');
  res.setHeader('Content-Type', 'application/json');
  var deckDataRef = firebase.database().ref('deckData/' + deckId);
  deckDataRef.once('value').then(function(resultDeckData) {
    var resultDeckDataVal = resultDeckData.val()
    var assetIds = [];
    // let assets = [];
    resultDeckDataVal.slides.forEach(function(slide,index) {
      slide.components.forEach(function(component, comIndex) {
        if (component.assetId) {
          assetIds.push(component.assetId);
        }
      });
    });
    var getAssertFunc = function(assetId, index) {
      return new Promise( function(resolve, reject) {
        var assetRef = firebase.database().ref('userAssets/' + assetId);
        resolve(
        assetRef.once('value').then(function(result) {
          var asset = result.val();
          if (asset){
            asset.id = assetId;
            //console.log(asset);
            // assets.push(asset);
            return asset;
          }
        }));
      });
    };
    var getDownloadUrlFunc = function(asset,index) {
      return new Promise( function(resolve, reject) {
        if (asset) {
          var curUser = asset.uid;
          var link = "";
          if (asset.type === "IMAGE") {
            link = "images/" + curUser + "/" + asset.fileName;
          } else if (asset.type === "OBJECT") {
            link = "models/" + curUser + "/" + asset.fileName;
          };
          //link = "images/XI0LVuvfgJMya8pQi7R9COiJ34Q2/0-02-06-2a92e13672d4a10e164dbc0b63365b6ce61434fd32c5c24d2bfb52892ed1853e_full.jpg-XI0LVuvfgJMya8pQi7R9COiJ34Q2";
          resolve(
            bucket.file(link).getSignedUrl({
              action: 'read',
              expires: '03-17-2025'
            }, function(err, url) {
              if (err) {
                console.error(err);
                reject(error);
                return;
              }
              asset.assetUrl = url;
              console.log("-----asset with URL");
              console.log(asset);
              //resolve();
              return asset;
            })
          );
        };
      });
    };
    var processFunc = function(asset,index) {
      if (asset) {
        console.log("3");
        console.log('loop slide');
        var slides = resultDeckDataVal.slides;
        console.log(slides);
        slides.forEach(function(slide, index) {
          slide.components.forEach(function(component, comIndex) {
            if ((component.type === "OBJECT" || component.type === "IMAGE") && asset.id === component.assetId) {
              console.log('--------component set');
              component.asset = asset;
              console.log(component);

            };
          });
        });
      }
    };
    Promise.all(assetIds.map(getAssertFunc))
    // .then( assets => {
    //   return Promise.all(assets.map(getDownloadUrlFunc))
    // })
    .then( function(assets) {
      console.log('4');
      assets.map(processFunc);
      res.json(resultDeckDataVal);
      return res;
    })
    .catch( function(err) { console.log(error)});

    // Promise.all(assets.map(getDownloadUrlFunc))
    // .then( assets => {
    //   assets.map(processFunc);
    //   res.json(resultDeckDataVal);
    //   return res;
    // })

  });
});

app.use(function(req, res) {
  Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      res.setHeader('Content-Type', 'text/html');
      //console.log(renderProps);
      //var html = ReactDOM.renderToString(React.createElement(Router.RouterContext, renderProps));
      var page = swig.renderFile('views/index.html');
      res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found')
    }
  });
});



// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});

// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
//  app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//      message: err.message,
//      error: err
//    });
//  });
//}

// production error handler
// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//    message: err.message,
//    error: {}
//  });
//});


module.exports = app;
