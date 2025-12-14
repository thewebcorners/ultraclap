// models/SliderBanner.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SliderBanner = sequelize.define(
  "SliderBanner",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: true },
    image_url: { type: DataTypes.TEXT, allowNull: false }, // store Cloudinary URL
    public_id: { type: DataTypes.STRING, allowNull: true }, // cloudinary public_id for deletion
    redirect_url: { type: DataTypes.STRING, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    display_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: "slider_banners",
    timestamps: true,
  }
);

module.exports = SliderBanner;
