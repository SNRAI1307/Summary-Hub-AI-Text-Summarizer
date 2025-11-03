'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Summary, {
        foreignKey: 'userId',
        as: 'summaries',
        onDelete: 'CASCADE',
      });
    }
  }
  User.init(
    {
      // --- CORRECTED STRUCTURE ---
      email: { // Optional: useful for reference
        type: DataTypes.STRING,
        allowNull: false,
        // unique: false, // Consider removing unique constraint if clerkUserId is the primary link
        validate: {
          isEmail: true,
        },
      }, // <-- Comma added here
      clerkUserId: { // <-- Moved to be a separate field
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      // --------------------------
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};