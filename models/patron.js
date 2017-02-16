'use strict';
module.exports = function(sequelize, DataTypes) {
  var Patron = sequelize.define('Patron', {
    id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true
      },
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    library_id: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        unique: true
      }
    },
    zip_code: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        isInt: true
      }
    }
  },
  {
    timestamps: false,
    underscored: true
  },
  {
    classMethods: {
      associate: function(models) {
        
      }
    }
  });
  return Patron;
};