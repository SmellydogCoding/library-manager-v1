var express = require('express');
var router = express.Router();
var models = require('../models');

models.Loan.belongsTo(models.Book);
models.Loan.belongsTo(models.Patron);
models.Book.hasMany(models.Loan);

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
  // console.log(req.body);
  models.Book.findById(req.body.bookid).then(function(book) {
    book.update(req.body).then(function() {
      res.redirect(303,'/books');
    });
  });
});

// Patrons Routes

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



router.get('/overdue/loans', function(req, res, next) {
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
    res.render('overdueloans', {loans: loans});
  });
});

router.get('/checkedout/loans', function(req, res, next) {
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
    res.render('checkedoutloans', {loans: loans});
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