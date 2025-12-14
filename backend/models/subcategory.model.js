const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Subcategory = sequelize.define(
  "Subcategory",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    icon_svg: DataTypes.TEXT,
    is_popular: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_trending: { type: DataTypes.BOOLEAN, defaultValue: false },

    // ✅ Foreign key stored in table
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { tableName: "subcategories", timestamps: true }
);

module.exports = Subcategory;
