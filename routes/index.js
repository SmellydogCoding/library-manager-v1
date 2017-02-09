var express = require('express');
var router = express.Router();
var models = require('../models');

models.Loan.belongsTo(models.Book);
models.Loan.belongsTo(models.Patron);
models.Book.hasMany(models.Loan);
models.Patron.hasMany(models.Loan);

// Home Route
router.get('/', function(req, res, next) {
  res.render('index');
});

// Books Routes

router.get('/books', function(req, res, next) {
  if (req.query.filter === "overdue") {
    models.Loan.findAll({
      where: {
        $and: {
          return_by: {
            $lt: new Date()
          },
            returned_on: null
        }
      },
      include: [
        {
          model: models.Book
        }
      ]
    }).then(function(loans) {
      res.render('books', {loans: loans, filter: "overdue"});
    });
  } else if (req.query.filter == "checked_out") {
    models.Loan.findAll({
      where: {
        returned_on: null
      },
      include: [
        {
          model: models.Book
        }
      ]
    }).then(function(loans) {
      res.render('books', {loans: loans, filter: "checked"});
    });
  } else {
    models.Book.findAll().then(function(books) {
      res.render('books', {books: books, filter: "all"});
    });
  }
});

router.get('/books/new', function(req, res, next) {
  res.render('newbook');
});

router.post('/books/new', function(req, res, next) {
  models.Book.create(req.body).then(function() {
    res.redirect('/books');
  });
});

router.get('/books/update/:bookid', function(req, res, next) {
  models.Book.find({
    where: {
      id: req.params.bookid
    },
    include: [
      {
        model: models.Loan,
        include: [{
          model: models.Patron
        }]
      }
    ]
  }).then(function(book) {
    res.render('bookdetail', {book: book});
  });
});

router.put('/books/update', function(req, res, next) {
  models.Book.findById(req.body.bookid).then(function(book) {
    book.update(req.body).then(function() {
      res.redirect(303,'/books');
    });
  });
});

// Patrons Routes

router.get('/patrons', function(req, res, next) {
  models.Patron.findAll().then(function(patrons) {
    res.render('patrons', {patrons: patrons});
  });
});

router.get('/patrons/update/:patronid', function(req, res, next) {
  models.Patron.find({
    where: {
      id: req.params.patronid
    },
    include: [
      {
        model: models.Loan,
        include: [{
          model: models.Book
        }]
      }
    ]
  }).then(function(patron) {
    res.render('patrondetail', {patron: patron});
  });
});

router.put('/patrons/update', function(req, res, next) {
  models.Patron.findById(req.body.patronid).then(function(patron) {
    patron.update(req.body).then(function() {
      res.redirect(303,'/patrons');
    });
  });
});

// Loans Routes

router.get('/loans', function(req, res, next) {
  if (req.query.filter === "overdue") {
    models.Loan.findAll({
      where: {
        $and: {
          return_by: {
            $lt: new Date()
          },
            returned_on: null
        }
      },
      include: [
        {
          model: models.Book
        },
        {
          model: models.Patron
        }
      ]
    }).then(function(loans) {
      res.render('loans', {loans: loans, filter: "overdue"});
    });
  } else if (req.query.filter == "checked_out") {
    models.Loan.findAll({
      where: {
        returned_on: null
      },
      include: [
        {
          model: models.Book
        },
        {
          model: models.Patron
        }
      ]
    }).then(function(loans) {
      res.render('loans', {loans: loans, filter: "checked"});
    });
  } else {
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
      res.render('loans', {loans: loans, filter: "all"});
    });
  }
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