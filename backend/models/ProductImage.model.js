const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Product = require("./product.model");

const ProductImage = sequelize.define("ProductImage", {
  image_url: DataTypes.TEXT,
  is_primary: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: "product_images" });

ProductImage.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(ProductImage, { foreignKey: "product_id" });

module.exports = ProductImage;
