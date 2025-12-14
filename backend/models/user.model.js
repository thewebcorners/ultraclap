const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: { isEmail: true },
    },

    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },

    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },

    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    otpExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    role: {
      type: DataTypes.ENUM("customer", "businessOwner", "admin"),
      allowNull: false,
      defaultValue: "customer",
    },

    // ✅ Using STRING for flexibility (PostgreSQL, MySQL, MariaDB friendly)
    profile_pic: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "User profile image URL",
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
      comment: "active | inactive | banned",
    },
  },
  {
    tableName: "users",
    timestamps: true,
    underscored: false,
  }
);

module.exports = User;
