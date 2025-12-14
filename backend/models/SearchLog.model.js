const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const AdminUser = require("./adminUser.model");

const SearchLog = sequelize.define("SearchLog", {
  search_type: DataTypes.ENUM("category","subcategory","business","product","service"),
  search_item_id: DataTypes.INTEGER,
  search_count: { type: DataTypes.INTEGER, defaultValue: 1 },
  search_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: "search_logs" });

SearchLog.belongsTo(AdminUser, { foreignKey: "user_id" });

module.exports = SearchLog;
