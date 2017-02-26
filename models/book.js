'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "The Title field can not be blank."
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "The Author field can not be blank."
        }
      }
    },
    genre: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "The Genre field can not be blank."
        }
      }
    },
    first_published: {
      type: DataTypes.INTEGER,
      validate: {
        validYear: (value) => {
          const zipValidation = /^[0-9]{4}$/;
          if (value !== "") {
            if (!zipValidation.test(value)) {
              throw new Error('The First Published field must be 4 digits.  This field may be left blank if desired.');
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
  return Book;
};