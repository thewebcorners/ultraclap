const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AdminUser = sequelize.define("AdminUser", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("admin","moderator"), defaultValue: "admin" },
}, { tableName: "admin_users" });

module.exports = AdminUser;
