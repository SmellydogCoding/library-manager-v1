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