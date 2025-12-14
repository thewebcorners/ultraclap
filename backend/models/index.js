const sequelize = require("../config/db");

// Import models
const User = require("./user.model");
const AdminUser = require("./adminUser.model");
const Category = require("./category.model");
const Subcategory = require("./subcategory.model");
const Business = require("./business.model");
const BusinessContact = require("./BusinessContact.model");
const BusinessMedia = require("./businessMedia.model");
const Product = require("./product.model");
const ProductImage = require("./productImage.model");
const Service = require("./service.model");
const ServiceMedia = require("./serviceMedia.model");
const Enquiry = require("./enquiry.model");
const Review = require("./review.model");
const SearchLog = require("./searchLog.model");
const FeaturedItem = require("./featuredItem.model");
const UserFavorite = require("./userFavorite.model");
const Analytics = require("./analytics.model");
const Article = require("./article.model");
const CategoryWiseService = require("./categoryWiseService");
const SliderBanner  = require("./SliderBanner");

// ✅ Business owner
Business.belongsTo(User, { foreignKey: "owner_id" });
User.hasMany(Business, { foreignKey: "owner_id" });

// ✅ Category & Subcategory
Subcategory.belongsTo(Category, { foreignKey: "category_id" });
Category.hasMany(Subcategory, { foreignKey: "category_id" });
Category.hasMany(CategoryWiseService, { foreignKey: "category_id" });
CategoryWiseService.belongsTo(Category, { foreignKey: "category_id" });

Subcategory.hasMany(CategoryWiseService, { foreignKey: "subcategory_id" });
CategoryWiseService.belongsTo(Subcategory, { foreignKey: "subcategory_id" });
// ✅ Business relations
Business.belongsTo(Category, { foreignKey: "category_id" });
Business.belongsTo(Subcategory, { foreignKey: "subcategory_id" });
Business.hasMany(BusinessContact, { foreignKey: "business_id" });
Business.hasMany(BusinessMedia, { foreignKey: "business_id" });
Business.hasMany(Review, { foreignKey: "business_id" });
Business.hasMany(Article, { foreignKey: "business_id" });

// ✅ BusinessMedia reverse
BusinessMedia.belongsTo(Business, { foreignKey: "business_id" });

// ✅ Review relations
Review.belongsTo(User, { foreignKey: "user_id" });
Review.belongsTo(Business, { foreignKey: "business_id" });
Review.belongsTo(Product, { foreignKey: "product_id" });
Review.belongsTo(Service, { foreignKey: "service_id" });

// ✅ Product relations
Product.belongsTo(Business, { foreignKey: "business_id" });
Product.belongsTo(Category, { foreignKey: "category_id" });
Product.belongsTo(Subcategory, { foreignKey: "subcategory_id" });
Product.hasMany(ProductImage, { foreignKey: "product_id" });
ProductImage.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(ProductImage, { foreignKey: "product_id" });

// ✅ Service relations
Service.belongsTo(Business, { foreignKey: "business_id" });
Service.belongsTo(Category, { foreignKey: "category_id" });
Service.belongsTo(Subcategory, { foreignKey: "subcategory_id" });
Service.hasMany(ServiceMedia, { foreignKey: "service_id" });

// ✅ Logs & analytics
SearchLog.belongsTo(User, { foreignKey: "user_id" });
UserFavorite.belongsTo(User, { foreignKey: "user_id" });
Analytics.belongsTo(User, { foreignKey: "user_id" });
Article.belongsTo(Category, { foreignKey: "category_id" });
Article.belongsTo(Subcategory, { foreignKey: "subcategory_id"});
Article.belongsTo(Business, { foreignKey: "business_id" });


module.exports = {
  sequelize,
  User,
  AdminUser,
  Category,
  Subcategory,
  CategoryWiseService,
  Business,
  BusinessContact,
  BusinessMedia,
  Product,
  ProductImage,
  Service,
  ServiceMedia,
  Enquiry,
  Review,
  SearchLog,
  FeaturedItem,
  UserFavorite,
  Analytics,
  Article,
  SliderBanner,
};
