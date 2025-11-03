'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Summary extends Model {
    static associate(models) {
      Summary.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      Summary.belongsTo(models.Article, {
        foreignKey: 'articleId',
        as: 'article',
      });
    }
  }
  Summary.init(
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Untitled Summary'
      },
    },
    {
      sequelize,
      modelName: 'Summary',
    }
  );
  return Summary;
};