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

app.get('/deck', function(req, res, next) {
  console.log("start");
  var firebase = require('firebase');
  //var underscore = require('underscore');
  var promises = [];
  var assets = []
  res.setHeader('Content-Type', 'text/application/json');
  var deckDataRef = firebase.database().ref('deckData/-KRYojjoQUh-cb-hMbWY'); // + deckId);
  deckDataRef.once('value').then(function(resultDeckData) {
    let resultDeckDataVal = resultDeckData.val()
    console.log(resultDeckData.val());
    var assetIds = [];
    resultDeckDataVal.slides.forEach((slide,index) => {
      slide.components.forEach((component, comIndex) => {
        if (component.assetId) {
          assetIds.push(component.assetId);
        }
      });
    });
    console.log(assetIds);

    Promise.all(assetIds.map((assetId, index) => {
      //var uid = firebase.auth().currentUser.uid;
      console.log(assetId);
      var assetRef = firebase.database().ref('userAssets/' + assetId);
      assetRef.once('value').then((result) => {
        if (result.val()){
          assets.push(result.val());
          console.log(assets);
        }
      });
    })).then( () => {
      resultDeckDataVal.slides.forEach((slide,index) => {
        console.log('loop slide');
        console.log(assets);
        slide.components.forEach((component, comIndex) => {
          console.log(component);
          assets.forEach((asset, index) => {
            console.log('loop component');
            console.log(asset);
            if (asset.key === component.assetId) {
              component.asset.fileName = asset.fileName;
              component.asset.type = asset.type;
              component.asset.uid = asset.uid;
              console.log(component);
            }
          });
        });
      });
      console.log(resultDeckDataVal)
      res.json(resultDeckDataVal);
    });
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
