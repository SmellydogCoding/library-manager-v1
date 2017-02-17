'use strict';
module.exports = function(sequelize, DataTypes) {
  var Patron = sequelize.define('Patron', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "The First Name field can not be blank"
        }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "The Last Name field can not be blank"
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "The Address field can not be blank"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "The Email field can not be blank"
        },
        isEmail: {
          msg: "That is not a valid email address"
        }
      }
    },
    library_id: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "The Library Id field can not be blank"
        }
      }
    },
    zip_code: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "The Zip Code field can not be blank"
        },
        isEven: function(value) {
        if (!value.isInteger() || !value.toString().length === 5) {
          throw new Error('That is not a valid zip code')
        }
      }
        // isInt: {
        //   msg: "That is not a valid zip code (please use the 5 digit zip code)"
        // },
        // len: {
        //   args: [5],
        //   msg: "That is not a valid zip code (please use the 5 digit zip code)"
        // }
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