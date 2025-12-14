const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const FeaturedItem = sequelize.define("FeaturedItem", {
  item_type: DataTypes.ENUM("category","subcategory","business","product","service"),
  item_id: DataTypes.INTEGER,
  start_date: DataTypes.DATE,
  end_date: DataTypes.DATE
}, { tableName: "featured_items" });

module.exports = FeaturedItem;
