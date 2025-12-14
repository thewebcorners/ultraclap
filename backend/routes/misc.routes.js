// routes/misc.routes.js
const express = require("express");
const router = express.Router();
const miscController = require("../controllers/misc.controller");

router.get("/trending-cities", miscController.getTrendingCities);
router.get("/popular-searches", miscController.getPopularSearches);
router.get("/featured-items", miscController.getFeaturedItems);
router.get("/recent-activity", miscController.getRecentActivity);

module.exports = router;
