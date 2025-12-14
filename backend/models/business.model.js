const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Business = sequelize.define(
  "Business",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    pincode: DataTypes.STRING(10),
    plot: DataTypes.STRING,
    building: DataTypes.STRING,
    street: DataTypes.STRING,
    landmark: DataTypes.STRING,
    area: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    cloudinary_image_url: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("Active", "Inactive", "Banned"),
      defaultValue: "Active",
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
    category_id: DataTypes.INTEGER,
    subcategory_id: DataTypes.INTEGER,
  },
  { tableName: "businesses", timestamps: true }
);

module.exports = Business;
