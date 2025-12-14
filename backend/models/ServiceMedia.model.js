const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// IMPORTANT: Correct import (must match your filename exactly)
const Service = require("./service.model");

const ServiceMedia = sequelize.define("ServiceMedia", {
  media_type: {
    type: DataTypes.ENUM("image", "video"),
    allowNull: false
  },
  media_url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_primary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, { 
  tableName: "service_media",
  timestamps: false
});

// Associations — MUST come AFTER define()
ServiceMedia.belongsTo(Service, { foreignKey: "service_id" });
Service.hasMany(ServiceMedia, { foreignKey: "service_id" });

module.exports = ServiceMedia;
