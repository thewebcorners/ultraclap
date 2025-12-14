// controllers/misc.controller.js
const { SearchLog, FeaturedItem, Business,Category,Subcategory, Product, Service, sequelize } = require("../models");
const { Op } = require("sequelize");

// Get Trending Cities dynamically from BusinessLocation
exports.getTrendingCities = async (req, res) => {
  try {
    const cities = await Business.findAll({
      attributes: [
        "city",
        [sequelize.fn("COUNT", sequelize.col("city")), "count"]
      ],
      group: ["city"],
      order: [[sequelize.literal("count"), "DESC"]],
      limit: 10
    });

    res.json(cities.map(c => c.city));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Popular Searches dynamically from SearchLog
exports.getPopularSearches = async (req, res) => {
  try {
    // Step 1: Aggregate top 10 search items
    const popular = await SearchLog.findAll({
      attributes: [
        "search_item_id",
        "search_type",
        [sequelize.fn("SUM", sequelize.col("search_count")), "total_count"]
      ],
      group: ["search_item_id", "search_type"],
      order: [[sequelize.literal("total_count"), "DESC"]],
      limit: 10,
      raw: true
    });

    // Step 2: For each type, fetch details from the relevant table
    const groupedByType = popular.reduce((acc, item) => {
      if (!acc[item.search_type]) acc[item.search_type] = [];
      acc[item.search_type].push(item.search_item_id);
      return acc;
    }, {});

    // Step 3: Fetch item names
    const [businesses, categories, subcategories, products, services] =
      await Promise.all([
        groupedByType.business
          ? Business.findAll({
              where: { id: groupedByType.business },
              attributes: ["id", "business_name"]
            })
          : [],
        groupedByType.category
          ? Category.findAll({
              where: { id: groupedByType.category },
              attributes: ["id", "name"]
            })
          : [],
        groupedByType.subcategory
          ? Subcategory.findAll({
              where: { id: groupedByType.subcategory },
              attributes: ["id", "name"]
            })
          : [],
        groupedByType.product
          ? Product.findAll({
              where: { id: groupedByType.product },
              attributes: ["id", "name"]
            })
          : [],
        groupedByType.service
          ? Service.findAll({
              where: { id: groupedByType.service },
              attributes: ["id", "name"]
            })
          : [],
      ]);

    // Step 4: Create lookup maps
    const maps = {
      business: Object.fromEntries(
        businesses.map((b) => [b.id, b.business_name])
      ),
      category: Object.fromEntries(categories.map((c) => [c.id, c.name])),
      subcategory: Object.fromEntries(subcategories.map((s) => [s.id, s.name])),
      product: Object.fromEntries(products.map((p) => [p.id, p.name])),
      service: Object.fromEntries(services.map((s) => [s.id, s.name])),
    };

    // Step 5: Merge readable names into result
    const result = popular.map((item) => ({
      type: item.search_type,
      id: item.search_item_id,
      name: maps[item.search_type]?.[item.search_item_id] || "Unknown",
      total_count: item.total_count,
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching popular searches:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get Featured Items (Businesses, Products, Services)
exports.getFeaturedItems = async (req, res) => {
  try {
    const featured = await FeaturedItem.findAll({
      include: [
        { model: Business, attributes: ["id", "name"] },
        { model: Product, attributes: ["id", "name"] },
        { model: Service, attributes: ["id", "name"] }
      ],
      order: [["createdAt", "DESC"]],
      limit: 10
    });

    res.json(featured);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Recent Activity: latest Businesses, Products, Services
exports.getRecentActivity = async (req, res) => {
  try {
    const latestBusinesses = await Business.findAll({
      attributes: ["id", "name"],
      order: [["createdAt", "DESC"]],
      limit: 5
    });

    const latestProducts = await Product.findAll({
      attributes: ["id", "name"],
      order: [["createdAt", "DESC"]],
      limit: 5
    });

    const latestServices = await Service.findAll({
      attributes: ["id", "name"],
      order: [["createdAt", "DESC"]],
      limit: 5
    });

    res.json({
      businesses: latestBusinesses,
      products: latestProducts,
      services: latestServices
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
