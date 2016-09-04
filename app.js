// Babel ES6/JSX Compiler
require('babel-register');
require("babel-polyfill");

var express = require('express');
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

  browserify()
    .add('./main.js')
    .transform(babelify, { presets: ['es2015', 'react'] })
    .transform(literalify.configure({
      'react': 'window.React',
      'react-dom': 'window.ReactDOM'
    }))
    .bundle()
    .pipe(res)

});

app.use(function(req, res) {
  Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      var html = ReactDOM.renderToString(React.createElement(Router.RouterContext, renderProps));
      var page = swig.renderFile('views/index.html', { html: html });
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
