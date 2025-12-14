const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const AdminUser = require("./adminUser.model");

const UserFavorite = sequelize.define("UserFavorite", {
  item_type: DataTypes.ENUM("business","product","service"),
  item_id: DataTypes.INTEGER
}, { tableName: "user_favorites" });

UserFavorite.belongsTo(AdminUser, { foreignKey: "user_id" });

module.exports = UserFavorite;
