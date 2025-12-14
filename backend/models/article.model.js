const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Article = sequelize.define("Article", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, unique: true },
  content: { type: DataTypes.TEXT, allowNull: false },
  thumbnail_url: { type: DataTypes.STRING },
  thumbnail_public_id: { type: DataTypes.STRING },
  business_id: { type: DataTypes.INTEGER },
  category_id: { type: DataTypes.INTEGER },
  subcategory_id: { type: DataTypes.INTEGER },
  status: {
    type: DataTypes.ENUM("draft", "published"),
    defaultValue: "draft",
  },
  views: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = Article;
