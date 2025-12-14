const express = require("express");
const router = express.Router();
const controller = require("../controllers/subcategory.controller");
const upload = require("../utils/multer");

// ✅ Fetch subcategories by category slug
// Example: GET /api/subcategories?category=restaurants
router.get("/by-category/:category", controller.getSubcategoriesByCategory);

// ✅ Get all subcategories (admin/general)
router.get("/all", controller.getAll);

// ✅ Get single subcategory by ID
router.get("/:id", controller.getById);

// ✅ Create new subcategory
router.post("/", upload.single("file"), controller.create);

// ✅ Update subcategory
router.put("/:id", upload.single("file"), controller.update);

// ✅ Delete subcategory
router.delete("/:id", controller.delete);

module.exports = router;

