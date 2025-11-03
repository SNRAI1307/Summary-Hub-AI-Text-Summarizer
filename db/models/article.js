'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      Article.hasMany(models.Summary, {
        foreignKey: 'articleId',
        as: 'summaries',
        onDelete: 'CASCADE', 
      });
    }
  }
  Article.init(
    {
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isUrl: true,
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true, 
      },
    },
    {
      sequelize,
      modelName: 'Article',
    }
  );
  return Article;
};