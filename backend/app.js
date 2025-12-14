const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/services", require("./routes/categoryWiseService.routes"));
app.use("/api/sliderbanners", require("./routes/sliderBanner.routes"));
app.use("/api/admin-users", require("./routes/adminUser.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/subcategories", require("./routes/subcategory.routes"));
app.use("/api/businesses", require("./routes/business.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/services", require("./routes/service.routes"));
app.use("/api/enquiries", require("./routes/enquiry.routes"));
app.use("/api/reviews", require("./routes/review.routes"));
app.use("/api/search-logs", require("./routes/searchLog.routes"));
app.use("/api/featured-items", require("./routes/featuredItem.routes"));
app.use("/api/user-favorites", require("./routes/userFavorite.routes"));
app.use("/api/analytics", require("./routes/analytics.routes"));
app.use("/api/business-media", require("./routes/businessMedia.routes"));
app.use("/api/product-media", require("./routes/productMedia.routes"));
app.use("/api/service-media", require("./routes/serviceMedia.routes"));
app.use("/api/misc", require("./routes/misc.routes"));
app.use("/api/settings", require("./routes/settings.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/article",require("./routes/article.routes"));
app.use("/api/search",require("./routes/search"));
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

module.exports = app;
