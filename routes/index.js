var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
  models.Book.findAll().then(function(books){
    res.render('index', {books: books, title: "Library Manager"});
  });
});

module.exports = router;
