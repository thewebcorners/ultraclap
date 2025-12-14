const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define(
  "Product",
  {
    product_name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL(12, 2),
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },

    // ✅ Foreign keys
    business_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    subcategory_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  { tableName: "products", timestamps: true }
);

module.exports = Product;
