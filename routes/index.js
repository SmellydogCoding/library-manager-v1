'use strict';

const express = require('express');
const router = express.Router();
const models = require('../models');
const listCompiler = require('../ListCompiler.js');

// Relationships
models.Loan.belongsTo(models.Book);
models.Loan.belongsTo(models.Patron);
models.Book.hasMany(models.Loan);
models.Patron.hasMany(models.Loan);

// Home Route

router.get('/', (req, res, next) => {
  res.render('index', {title: "Library Manager"});
});

// Books Routes

router.get('/books', (req, res, next) => {
  if (req.query.filter === "overdue") {
    models.Loan.findAll({
      attributes: [
        "book_id",
        "return_by",
        "returned_on"
      ],
      // overdue books are part of a loan that has a return by date before today and a empty returned on field
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
    }).then((loans) => {
      res.render('books', {loans, filter: "overdue", title: "Overdue Books"});
    });
  } else if (req.query.filter == "checked_out") {
    models.Loan.findAll({
      attributes: [
        "book_id",
        "returned_on"
      ],
      // checked out books are part of a loan that has a empty returned on field
      where: {
        returned_on: null
      },
      include: [
        {
          model: models.Book
        }
      ]
    }).then((loans) => {
      res.render('books', {loans, filter: "checked", title: "Checked Out Books"});
    });
  } else {
    models.Book.findAll().then((books) => {
      res.render('books', {books, filter: "all", title: "Books"});
    });
  }
});

router.get('/books/new', (req, res, next) => {
  res.render('newbook', {title: "New Book"});
});

router.post('/books/new', (req, res, next) => {
  models.Book.create(req.body).then(() => {
    res.redirect('/books');
  }).catch((errors) => {
    if (errors.name === "SequelizeValidationError") {
      errors = listCompiler.create(errors);
      res.render('newbook', {title: "New Book", errors, data: res.req.body});
    } else {
      throw error;
    }
  }); 
});

router.get('/books/update/:bookid', (req, res, next) => {
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
  }).then((book) => {
    res.render('bookdetail', {book, title: book.title});
  });
});

router.put('/books/update', (req, res, next) => {
  models.Book.findById(req.body.bookid).then((book) => {
    book.update(req.body).then(() => {
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
        // if there's a validation error updating a book, you have to query that book again
        // to get the related loan history
        Promise.all([book]).then((book) => {
          errors = listCompiler.create(errors);
        res.render('bookdetail', {title: book[0].title, errors, book: book[0], data: res.req.body});
        });
      } else {
        throw error;
      }
    });
  });
});

// Patrons Routes

router.get('/patrons', (req, res, next) => {
  models.Patron.findAll().then((patrons) => {
    res.render('patrons', {patrons, title: "Patrons"});
  });
});

router.get('/patrons/new', (req, res, next) => {
  res.render('newpatron', {title: "New Patron"});
});

router.post('/patrons/new', (req, res, next) => {
  models.Patron.create(req.body).then(() => {
    res.redirect('/patrons');
  }).catch((errors) => {
    if (errors.name === "SequelizeValidationError") {
      errors = listCompiler.create(errors);
      res.render('newpatron', {title: "New Patron", errors, data: res.req.body});
    } else {
      throw error;
    }
  });
});

router.get('/patrons/update/:patronid', (req, res, next) => {
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
  }).then((patron) => {
    res.render('patrondetail', {patron, title: patron.first_name + " " + patron.last_name});
  });
});

router.put('/patrons/update', (req, res, next) => {
  models.Patron.findById(req.body.patronid).then((patron) => {
    patron.update(req.body).then(() => {
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
        // if there's a validation error updating a patron, you have to query that patron again
        // to get the related loan history
        Promise.all([patron]).then((patron) => {
          errors = listCompiler.create(errors);
        res.render('patrondetail', {title: patron[0].first_name + " " + patron[0].last_name, errors, patron: patron[0], data: res.req.body});
        });
      } else {
        throw error;
      }
    });
  });
});

// Loans Routes

router.get('/loans', (req, res, next) => {
  if (req.query.filter === "overdue") {
    models.Loan.findAll({
      // overdue loans have a return by date before today and a empty returned on field
      where: {
        $and: {
          return_by: {
            $lt: new Date()
          },
            returned_on: null
        }
      },
      // loans have a related book and patron
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
    }).then((loans) => {
      res.render('loans', {loans, filter: "overdue", title: "Overdue Loans"});
    });
  } else if (req.query.filter == "checked_out") {
    models.Loan.findAll({
      // checked out loans have an empty returned on field
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
    }).then((loans) => {
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
    }).then((loans) => {
      res.render('loans', {loans, filter: "all", title: "Loans"});
    });
  }
});

router.get('/loans/new', (req, res, next) => {
  let books = models.Book.findAll({
    attributes: [
      'id',
      'title'
    ],
    include: [
      {
        model: models.Loan,
        attributes: [
          "returned_on"
        ]
      }
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
  // get a list of books and patrons for the select options on the new loan page
  Promise.all([books,patrons]).then((querys) => {
    let date = new Date();
    // get the yyyy-mm-dd format
    let today = date.toISOString().slice(0,10);
    // and add 7 days and convert it to the yyyy-mm-dd format
    let nextWeek = date.setDate(date.getDate() + 7);
    nextWeek = new Date(nextWeek).toISOString().slice(0,10);
    const booksInTheLibrary = listCompiler.filterCheckedOutBooks(querys[0]);
    res.render('newloan', {books: booksInTheLibrary, patrons: querys[1], today, nextWeek, title: "New Loan"});
  });
});

router.post('/loans/new', (req, res, next) => {
  models.Loan.create(req.body).then(() => {
    res.redirect('/loans');
  }).catch((errors) => {
    if (errors.name === "SequelizeValidationError") {
      let books = models.Book.findAll({
        attributes: [
          'id',
          'title'
        ],
        include: [
          {
            model: models.Loan,
            attributes: [
              "returned_on"
            ]
          }
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
      // if there's a validation error creating a loan, you have to get a list of books and patrons again
      Promise.all([books,patrons]).then((querys) => {
          const booksInTheLibrary = listCompiler.filterCheckedOutBooks(querys[0]);
          errors = listCompiler.create(errors);
          res.render('newloan', {title: "New Loan",books: booksInTheLibrary, patrons: querys[1], errors, data: res.req.body});
      });
    } else {
      console.log(errors);
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
  }).then((loan) => {
      let today = new Date().toISOString().slice(0,10);
      res.render('returnbook', {loan, title: 'Return Book', today});
  });
});

router.put('/loans/return/:loanid',(req,res,next) => {
  models.Loan.find({
    where: {
      id: req.params.loanid
    }
  }).then((loan) => {
    // since a loan has an empty returned on date initally (when the book is checked out)
    // some validation has to be done on the put route instead of the loan model
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
          errors = listCompiler.create(errors);
          res.render('returnbook', {title: "Return Book", errors, data: res.req.body});
        } else {
          throw error;
        }
      });
    }
  });
});

router.post('/search', (req, res, next) => {
  if (req.query.type === "book") {
    // format search term
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
         // if no results
         res.render('search', {title: "Search Results", books, results: "false"});
       } else {
         // if results
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

module.exports = router;