'use strict';
module.exports = function(sequelize, DataTypes) {
  var Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    genre: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    first_published: DataTypes.INTEGER
    },
    {
      timestamps: false,
      underscored: true
    },
    {
    classMethods: {
      associate: function(models) {
        Book.belongsTo(models.Loan, {foreignKey: 'book_id'});
      }
    },
    instanceMethods: {
      
    }
  });
  return Book;
};