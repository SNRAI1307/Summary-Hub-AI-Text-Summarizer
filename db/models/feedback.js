'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    static associate(models) {
      // You could optionally link this to the User model later
      // if you add a foreign key to clerkUserId
    }
  }
  Feedback.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    clerkUserId: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Feedback',
  });
  return Feedback;
};