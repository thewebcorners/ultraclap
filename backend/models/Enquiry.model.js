const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const AdminUser = require("./adminUser.model");
const Business = require("./business.model");
const Product = require("./product.model");
const Service = require("./service.model");

const Enquiry = sequelize.define("Enquiry", {
  message: DataTypes.TEXT,
  status: { type: DataTypes.ENUM("pending","contacted","closed"), defaultValue: "pending" },
  response: DataTypes.TEXT,
  responded_at: DataTypes.DATE
}, { tableName: "enquiries" });

Enquiry.belongsTo(AdminUser, { foreignKey: "user_id" });
Enquiry.belongsTo(Business, { foreignKey: "business_id" });
Enquiry.belongsTo(Product, { foreignKey: "product_id" });
Enquiry.belongsTo(Service, { foreignKey: "service_id" });

module.exports = Enquiry;
