const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Category = sequelize.define("Category", {
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  icon_svg: DataTypes.TEXT,          // Add this
  is_popular: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_trending: { type: DataTypes.BOOLEAN, defaultValue: false },
  cat_type:DataTypes.TEXT
}, { tableName: "categories" });

module.exports = Category;