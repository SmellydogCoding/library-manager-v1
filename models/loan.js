'use strict';
const models = require('../models');
module.exports = (sequelize, DataTypes) => {
  const Loan = sequelize.define('Loan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    book_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "The Book ID field can not be blank. (If you see this error please tell the website creator.)"
        }
      }
    },
    patron_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "The Patron ID field can not be blank. (If you see this error please tell the website creator.)"
        }
      }
    },
    loaned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        validYear: (value) => {
          if (value === "") {
            throw new Error('The Loaned on field can not be blank');
          } else {
            const dateValidation = /^[2][0][1-2][0-9][-][0-1][0-9][-][0-3][0-9]$/;
            if (!dateValidation.test(value)) {
              throw new Error('That is not a valid date.  Dates must be in this format: yyyy-mm-dd.  Year must be between 2010 and 2029.  Month must be between 0 and 12.')
            } else if (parseInt(value[8] + value[9]) > 31) {
              throw new Error('That is not a valid date.  A month can not have more than 31 days.')
            }
          }
        }
      }
    },
    return_by: {
      type: DataTypes.DATEONLY,
      validate: {
        validYear: (value) => {
          if (value === "") {
            throw new Error('The Return by field can not be blank');
          } else {
            const dateValidation = /^[2][0][1-2][0-9][-][0-1][0-9][-][0-3][0-9]$/;
            if (!dateValidation.test(value)) {
              throw new Error('That is not a valid date.  Dates must be in this format: yyyy-mm-dd.  Year must be between 2010 and 2029.  Month must be between 0 and 12.')
            } else if (parseInt(value[8] + value[9]) > 31) {
              throw new Error('That is not a valid date.  A month can not have more than 31 days.')
            } else if (new Date(value) <= new Date()) {
              throw new Error ('That is not a valid date.  The Return by date must be after today.')
            }
          }
        }
      }
    },
    returned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        validDate: (value) => {
          if (value !== "") {
            const dateValidation = /^[2][0][1-2][0-9][-][0-1][0-9][-][0-3][0-9]$/;
            if (!dateValidation.test(value)) {
              throw new Error('That is not a valid date.  Dates must be in this format: yyyy-mm-dd.  Year must be between 2010 and 2029.  Month must be between 0 and 12.')
            } else if (parseInt(value[8] + value[9]) > 31) {
              throw new Error('That is not a valid date.  A month can not have more than 31 days.')
            }
          }
        }
      }
    }
  },
  {
    timestamps: false,
    underscored: true
  },
  {
    
  });
  
  return Loan;
};