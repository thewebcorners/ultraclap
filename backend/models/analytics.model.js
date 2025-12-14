const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const AdminUser = require("./adminUser.model");

const Analytics = sequelize.define("Analytics", {
  page_type: DataTypes.ENUM("home","category","subcategory","business","product","service"),
  page_id: DataTypes.INTEGER,
  action_type: DataTypes.ENUM("view","click","search")
}, { tableName: "analytics" });

Analytics.belongsTo(AdminUser, { foreignKey: "user_id" });

module.exports = Analytics;
