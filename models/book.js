'use strict';
module.exports = function(sequelize, DataTypes) {
  var Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      validate: {
        // name: property
        // or name: {msg: "custom error message"}
      }
    },
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    genre: DataTypes.STRING,
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
      // add some instance methods here
    }
  });
  return Book;
};