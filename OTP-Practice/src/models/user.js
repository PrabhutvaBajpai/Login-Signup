"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserOtp extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  UserOtp.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true, // ✅ Make 'id' the PRIMARY KEY
        type: DataTypes.INTEGER,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // ✅ Ensure uniqueness
        validate: {
          isEmail: true,
        },
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: false, // ✅ Prevent NULL values
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "UserOtp", // ✅ Ensure correct model name
      tableName: "userotps", // ✅ Explicitly set the table name
    }
  );
  return UserOtp;
};
