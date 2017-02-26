'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// Express App
const app = express();

// enable method=DELETE and method=PUT in HTML forms
app.use(methodOverride('_method'));

// Body Parser (must be called before routes)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// get routes file
const index = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// morgan logger
app.use(logger('dev'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

// use routes file for routine
app.use('/', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// error handler
app.use(function(error, req, res, next) {
  res.status(error.status || 500);
  let message = error.message;
  let status = res.statusCode;
  let stack = error.stack;
  res.render('error', {message, status, stack});
});

module.exports = app;