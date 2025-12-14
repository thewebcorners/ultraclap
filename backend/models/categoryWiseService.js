const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CategoryWiseService = sequelize.define(
  "CategoryWiseService",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    service_name: { type: DataTypes.STRING, allowNull: false },

    slug: { type: DataTypes.STRING, allowNull: false },

    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { tableName: "categorywise_services", timestamps: true }
);

module.exports = CategoryWiseService;
