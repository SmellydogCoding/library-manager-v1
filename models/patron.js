'use strict';
module.exports = (sequelize, DataTypes) => {
  const Patron = sequelize.define('Patron', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "The First Name field can not be blank."
        }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "The Last Name field can not be blank."
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "The Address field can not be blank."
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        // I use a custom validation if there is more than one validation for a field
        // so that the user only sees one error message at a time about that field
        validEmail: (value,next) => {
          const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          if (value === "") {
            throw new Error('The Email field can not be blank.');
          } else if (!emailValidation.test(value)) {
            throw new Error('That is not a valid email address.');
          } else {
            Patron.find({
              where: {
                email: value
              },
              attributes: [
                "email"
              ]
            }).then((patron) => {
              if (patron) {
                return next('That email is already in use, please choose another.');
              }
              next();
            });
          }
        }
      }
    },
    library_id: {
      type: DataTypes.STRING,
      validate: {
        validID: (value,next) => {
          const idValidation = /^[M][C][L][0-9]{1,}$/;
          if (value === "") {
            throw new Error('The Library Id field can not be blank.');
          } else if (!idValidation.test(value)) {
            throw new Error('Library id must start with "MCL" and contain at least one number and no punctuation.');
          } else {
            Patron.find({
              where: {
                library_id: value
              },
              attributes: [
                "library_id"
              ]
            }).then((patron) => {
              if (patron) {
                return next('That Library id is already in use, please choose another.');
              }
              next();
            });
          }
        }
      }
    },
    zip_code: {
      type: DataTypes.INTEGER,
      validate: {
        validZip: (value) => {
          const zipValidation = /^[0-9]{5}$/;
          if (value === "") {
            throw new Error('The Zip Code field can not be blank.')
          } else if (!zipValidation.test(value)) {
            throw new Error('That is not a valid zip code.  Zip code must be 5 digits, numbers only.')
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
  return Patron;
};