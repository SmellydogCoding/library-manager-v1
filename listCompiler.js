'use strict';
// creates a simple list of form fields that didn't pass validation so that css can be applied
exports.create = (errors) => {
  let errorArray = errors.errors;
  errors.fieldList = {};
  errorArray.forEach((value) => {
    let key = value.path;
    errors.fieldList[key] = key;
  });
  return errors
}

// create a list of books that are currently in the library
exports.filterCheckedOutBooks = (books) => {
  let bookList = [];
  books.forEach((value) => {
    // if a book has a loan history
    if (value.Loans.length !== 0) {
      let inTheLibrary = true;
      // evaluate each history to see if the returned_on field is null, which indicates the book is out
      value.Loans.forEach((loan) => {
        if (loan.returned_on === null) {
          inTheLibrary = false;
        };
      });
      // if the book is in, add it to the list
      if (inTheLibrary) {
        let book = {id: value.id, title: value.title};
        bookList.push(book);
      }
    // if a book has no loan history, we assume that it is in the library  
    } else if (value.Loans.length === 0) {
        let book = {id: value.id, title: value.title};
        bookList.push(book);
    };
  });
  return bookList
}
// if I had designed the schema for this database, I would have added a in_or_out field to the Book model instead of going through all of this.