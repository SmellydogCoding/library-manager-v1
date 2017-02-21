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
  }).catch((errors) => {
    if (errors.name === "SequelizeValidationError") {
      errors = createFieldList(errors);
      res.render('newbook', {title: "New Book", errors, data: res.req.body});
    } else {
      throw error;
    }
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
    }).catch((errors) => {
      if (errors.name === "SequelizeValidationError") {
        let book = models.Book.find({
          where: {
            id: res.req.body.bookid
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
                  "last_name"
                ],
              }]
            }
          ]
        });
        Promise.all([book]).then((book) => {
          errors = createFieldList(errors);
        res.render('bookdetail', {title: book[0].title, errors, book: book[0], data: res.req.body});
        });
      } else {
        throw error;
      }
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
  }).catch((errors) => {
    if (errors.name === "SequelizeValidationError") {
      errors = createFieldList(errors);
      res.render('newpatron', {title: "New Patron", errors, data: res.req.body});
    } else {
      throw error;
    }
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
    }).catch((errors) => {
      if (errors.name === "SequelizeValidationError") {
        let patron = models.Patron.find({
          where: {
            id: res.req.body.patronid
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
        });
        Promise.all([patron]).then((patron) => {
          errors = createFieldList(errors);
        res.render('patrondetail', {title: patron[0].first_name + " " + patron[0].last_name, errors, patron: patron[0], data: res.req.body});
        });
      } else {
        throw error;
      }
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
      'id',
      'title'
    ]
  });
  let patrons = models.Patron.findAll({
    attributes: [
      'id',
      'first_name',
      'last_name',
      'library_id'
    ]
  });
  Promise.all([books,patrons]).then(function(querys) {
    let date = new Date();
    let today = date.toISOString().slice(0,10);
    let nextWeek = date.setDate(date.getDate() + 7);
    nextWeek = new Date(nextWeek).toISOString().slice(0,10);
    res.render('newloan', {books: querys[0], patrons: querys[1], today, nextWeek, title: "New Loan"});
  });
});

router.post('/loans/new', function(req, res, next) {
  models.Loan.create(req.body).then(function() {
    res.redirect('/loans');
  }).catch((errors) => {
    if (errors.name === "SequelizeValidationError") {
      let books = models.Book.findAll({
        attributes: [
          'id',
          'title'
        ]
      });
      let patrons = models.Patron.findAll({
        attributes: [
          'id',
          'first_name',
          'last_name',
          'library_id'
        ]
      });
      Promise.all([books,patrons]).then(function(querys) {
          errors = createFieldList(errors);
          res.render('newloan', {title: "New Loan",books: querys[0], patrons: querys[1], errors, data: res.req.body});
      });
    } else {
      throw error;
    }
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
      let today = new Date().toISOString().slice(0,10);
      res.render('returnbook', {loan, title: 'Return Book', today});
  });
});

router.put('/loans/return/:loanid',(req,res,next) => {
  models.Loan.find({
    where: {
      id: req.params.loanid
    }
  }).then(function(loan) {
    if (res.req.body.returned_on === "") {
      let errors = {errors:[{message: 'The Returned on field can not be blank.'}]};
      res.render('returnbook', {title: 'Return Book', errors, data: res.req.body});
    } else if (new Date(res.req.body.returned_on) < new Date(loan.loaned_on)) {
      let errors = {errors:[{message: 'The Returned on date can not be before the Loaned on date.'}]};
      res.render('returnbook', {title: 'Return Book', errors, data: res.req.body});
    } else {
      loan.update({
        returned_on: res.req.body.returned_on
      }).then((loan) => {
        res.redirect('/loans');
      }).catch((errors) => {
        if (errors.name === "SequelizeValidationError") {
          errors = createFieldList(errors);
          res.render('returnbook', {title: "Return Book", errors, data: res.req.body});
        } else {
          throw error;
        }
      });
    }
  });
});

router.post('/search', function(req, res, next) {
  if (req.query.type === "book") {
    let searchTerm = '%' + req.body.query + '%';
    models.Book.findAll({
      where: {
        $or: [
          {
            title: {
              $like: searchTerm
            }
          },
          {
            author: {
              $like: searchTerm
            }
          },
          {
            genre: {
              $like: searchTerm
            }
          }
        ]
      }
    }).then((books) => {
       if (books.length === 0) {
         res.render('search', {title: "Search Results", books, results: "false"});
       } else {
        res.render('search', {title: "Search Results", books});
       }
    }).catch((error) => {
      res.render('search', {title: "Search Results", message: error.message});
    });
  } else if (req.query.type === "patron") {
    let searchTerm = '%' + req.body.query + '%';
    models.Patron.findAll({
      where: {
        $or: [
          {
            first_name: {
              $like: searchTerm
            }
          },
          {
            last_name: {
              $like: searchTerm
            }
          },
          {
            address: {
              $like: searchTerm
            }
          },
          {
            email: {
              $like: searchTerm
            }
          },
          {
            library_id: {
              $like: searchTerm
            }
          },
          {
            zip_code: {
              $like: searchTerm
            }
          }
        ]
      }
    }).then((patrons) => {
       if (patrons.length === 0) {
         res.render('search', {title: "Search Results", patrons, results: "false"});
       } else {
        res.render('search', {title: "Search Results", patrons});
       }
    }).catch((error) => {
        res.render('search', {title: "Search Results", message: error.message});
      });
  }
});  
  // }
  // models.Book.create(req.body).then(function() {
  //   res.redirect('/books');
  // }).catch((errors) => {
  //   if (errors.name === "SequelizeValidationError") {
  //     errors = createFieldList(errors);
  //     res.render('newbook', {title: "New Book", errors, data: res.req.body});
  //   } else {
  //     throw error;
  //   }
  // }); 
// });

const createFieldList = (errors) => {
  let errorArray = errors.errors;
  errors.fieldList = {};
  errorArray.forEach((value) => {
    let key = value.path;
    errors.fieldList[key] = key;
  });
  return errors
}

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