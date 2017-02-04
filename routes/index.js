var express = require('express');
var router = express.Router();
var models = require('../models');

models.Loan.belongsTo(models.Book);
models.Loan.belongsTo(models.Patron);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/allbooks', function(req, res, next) {
  models.Book.findAll().then(function(books) {
    res.render('allbooks', {books: books});
  });
});

router.get('/allpatrons', function(req, res, next) {
  models.Patron.findAll().then(function(patrons) {
    res.render('allpatrons', {patrons: patrons});
  });
});

router.get('/allloans', function(req, res, next) {
  models.Loan.findAll({
    include: [
      {
        model: models.Book
      },
      {
        model: models.Patron
      }
    ]
  }).then(function(loans) {
    res.render('allloans', {loans: loans});
  });
});

module.exports = router;

// use the build method
// use the create method to add rows to the database then redirect
// use findById to find something by the id field
// findAll({options}) order: [['column to order by','desc'],['second column to order by','ASC']]
// use the update method to update existing rows
// use the destroy method to delete rows
// model.findBy.then function(model) {return model.method}.then redirect.catch(function(error){log error})
// model.findBy.then function(model) {if model do stuff else error code}
// before .catch .catch(error) {if (error.name === "SequelizeValidationError") {rerender page with error message error.errors} else {throw error}}