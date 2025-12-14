const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const AdminUser = require("./adminUser.model");
const Business = require("./business.model");
const Product = require("./product.model");
const Service = require("./service.model");

const Review = sequelize.define("Review", {
  rating: { type: DataTypes.INTEGER, validate: { min:1, max:5 } },
  review_text: DataTypes.TEXT
}, { tableName: "reviews",timestamps: true });

Review.belongsTo(AdminUser, { foreignKey: "user_id" });
Review.belongsTo(Business, { foreignKey: "business_id" });
Review.belongsTo(Product, { foreignKey: "product_id" });
Review.belongsTo(Service, { foreignKey: "service_id" });

module.exports = Review;
