const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Business = require("./business.model");

const BusinessMedia = sequelize.define("BusinessMedia", {
  media_type: DataTypes.ENUM("image","video"),
  media_url: DataTypes.TEXT,
  is_primary: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: "business_media" });

BusinessMedia.belongsTo(Business, { foreignKey: "business_id" });
Business.hasMany(BusinessMedia, { foreignKey: "business_id" });

module.exports = BusinessMedia;
