const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");

// Categories
router.get("/categories", searchController.getCategories);

// Trending Cities
router.get("/trending-cities", searchController.getTrendingCities);

// Popular Searches
router.get("/popular-searches", searchController.getPopularSearches);

module.exports = router;
