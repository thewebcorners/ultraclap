const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Business = require("./business.model");
const Category = require("./category.model");
const Subcategory = require("./subcategory.model");

const Service = sequelize.define("Service", {
  service_name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  price_range: DataTypes.STRING,
  service_type: DataTypes.ENUM("one-time","subscription","hourly"),
}, { tableName: "services" });

Service.belongsTo(Business, { foreignKey: "business_id" });
Service.belongsTo(Category, { foreignKey: "category_id" });
Service.belongsTo(Subcategory, { foreignKey: "subcategory_id" });

module.exports = Service;
