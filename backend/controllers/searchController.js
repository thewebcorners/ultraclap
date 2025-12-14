const { Category, Subcategory, BusinessLocation, sequelize, SearchLog } = require("../models");

const searchController = {};

// Get all categories with subcategories
searchController.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "name", "icon"], // ensure icon field exists
      include: [{ model: Subcategory, attributes: ["id", "name"] }],
      order: [["name", "ASC"]],
    });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get trending cities based on business count
searchController.getTrendingCities = async (req, res) => {
  try {
    const cities = await BusinessLocation.findAll({
      attributes: [
        "city",
        [sequelize.fn("COUNT", sequelize.col("business_id")), "business_count"]
      ],
      group: ["city"],
      order: [[sequelize.literal("business_count"), "DESC"]],
      limit: 10
    });
    res.json(cities.map(c => c.city));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get popular searches based on search logs
searchController.getPopularSearches = async (req, res) => {
  try {
    const searches = await sequelize.query(
      `SELECT query, COUNT(*) as count 
       FROM "SearchLogs" 
       GROUP BY query 
       ORDER BY count DESC 
       LIMIT 10;`,
      { type: sequelize.QueryTypes.SELECT }
    );
    res.json(searches.map(s => s.query));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = searchController;
