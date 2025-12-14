const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Business = require("./business.model");

const BusinessContact = sequelize.define(
  "BusinessContact",
  {
    contact_type: {
      type: DataTypes.ENUM("phone", "email", "website","whatsapp"),
      allowNull: false
    },

    contact_value: {
      type: DataTypes.STRING,
      allowNull: false
    },

    extra_json: {
      type: DataTypes.JSONB,   // PostgreSQL JSONB
      allowNull: true
    }
  },
  {
    tableName: "business_contacts",
    timestamps: true
  }
);

// Relations
BusinessContact.belongsTo(Business, { foreignKey: "business_id" });
Business.hasMany(BusinessContact, { foreignKey: "business_id" });

module.exports = BusinessContact;
