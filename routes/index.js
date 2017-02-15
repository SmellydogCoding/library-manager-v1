var express = require('express');
var router = express.Router();
var models = require('../models');

models.Loan.belongsTo(models.Book);
models.Loan.belongsTo(models.Patron);
models.Book.hasMany(models.Loan);
models.Patron.hasMany(models.Loan);

// Home Route
router.get('/', function(req, res, next) {
  res.render('index', {title: "Library Manager"});
});

// Books Routes

router.get('/books', function(req, res, next) {
  if (req.query.filter === "overdue") {
    models.Loan.findAll({
      attributes: [
        "book_id",
        "return_by",
        "returned_on"
      ],
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
      res.render('books', {loans, filter: "overdue", title: "Overdue Books"});
    });
  } else if (req.query.filter == "checked_out") {
    models.Loan.findAll({
      attributes: [
        "book_id",
        "returned_on"
      ],
      where: {
        returned_on: null
      },
      include: [
        {
          model: models.Book
        }
      ]
    }).then(function(loans) {
      res.render('books', {loans, filter: "checked", title: "Checked Out Books"});
    });
  } else {
    models.Book.findAll().then(function(books) {
      res.render('books', {books, filter: "all", title: "Books"});
    });
  }
});

router.get('/books/new', function(req, res, next) {
  res.render('newbook', {title: "New Book"});
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
        attributes: [
          "id",
          "loaned_on",
          "return_by",
          "returned_on"
        ],
        include: [{
          model: models.Patron,
          attributes: [
            "id",
            "first_name",
            "last_name",
          ],
        }]
      }
    ]
  }).then(function(book) {
    res.render('bookdetail', {book, title: book.title});
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
    res.render('patrons', {patrons, title: "Patrons"});
  });
});

router.get('/patrons/new', function(req, res, next) {
  res.render('newpatron', {title: "New Patron"});
});

router.post('/patrons/new', function(req, res, next) {
  models.Patron.create(req.body).then(function() {
    res.redirect('/patrons');
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
        attributes: [
          "id",
          "loaned_on",
          "return_by",
          "returned_on"
        ],
        include: [{
          model: models.Book,
          attributes: [
            "id",
            "title"
          ],
        }]
      }
    ]
  }).then(function(patron) {
    res.render('patrondetail', {patron, title: patron.first_name + " " + patron.last_name});
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
          model: models.Book,
          attributes: [
            "id",
            "title"
          ],
        },
        {
          model: models.Patron,
          attributes: [
            "id",
            "first_name",
            "last_name"
          ],
        }
      ]
    }).then(function(loans) {
      res.render('loans', {loans, filter: "overdue", title: "Overdue Loans"});
    });
  } else if (req.query.filter == "checked_out") {
    models.Loan.findAll({
      where: {
        returned_on: null
      },
      include: [
        {
          model: models.Book,
          attributes: [
            "id",
            "title"
          ],
        },
        {
          model: models.Patron,
          attributes: [
            "id",
            "first_name",
            "last_name"
          ],
        }
      ]
    }).then(function(loans) {
      res.render('loans', {loans, filter: "checked", title: "Checked Out Books"});
    });
  } else {
      models.Loan.findAll({
      include: [
        {
          model: models.Book,
          attributes: [
            "id",
            "title"
          ],
        },
        {
          model: models.Patron,
          attributes: [
            "id",
            "first_name",
            "last_name"
          ],
        }
      ]
    }).then(function(loans) {
      res.render('loans', {loans, filter: "all", title: "Loans"});
    });
  }
});

router.get('/loans/new', function(req, res, next) {
  let books = models.Book.findAll({
    attributes: [
      'title'
    ]
  });
  let patrons = models.Patron.findAll({
    attributes: [
      'first_name',
      'last_name'
    ]
  });
  Promise.all([books,patrons]).then(function(querys) {
    res.render('newloan', {books: querys[0], patrons: querys[1], title: "New Loan"});
  });
});

router.post('/loans/new', function(req, res, next) {
  models.Loan.create(req.body).then(function() {
    res.redirect('/loans');
  });
});

router.get('/loans/return/:loanid',(req,res,next) => {
  models.Loan.find({
    where: {
      id: req.params.loanid
    },
    include: [
        {
          model: models.Book,
          attributes: [
            "id",
            'title'
          ]
        },
        {
          model: models.Patron,
          attributes: [
            "id",
            'first_name',
            'last_name'
          ]
        }
      ]
  }).then(function(loan) {
      res.render('returnbook', {loan,title: 'Return Book'});
  });
});

router.put('/loans/return/:loanid',(req,res,next) => {
  models.Loan.find({
    where: {
      id: req.params.loanid
    }
  }).then(function(loan) {
    let today = new Date().toISOString().slice(0,10);
    loan.update({
      returned_on: today
    }).then((loan) => {
      res.redirect('/loans');
    });
  });
});

router.get('/testnext', (req,res,next) => {
  req.one = "one";
  next();
}, (req,res,next) => {
  req.two = "two";
  next();
}, (req,res,next) => {
  req.three = "three";
  next();
}, (req,res,next) => {
  console.log(req.one,req.two,req.three);
  req.end();
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