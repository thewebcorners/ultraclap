const express = require("express");
const router = express.Router();

const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../controllers/categoryWiseServiceController");

// ==========================
// ⚙ Routes
// ==========================

// GET all services
router.get("/", getAll);

// GET single service by ID
router.get("/:id", getById);

// CREATE new category-wise service
router.post("/", create);

// UPDATE category-wise service
router.put("/:id", update);

// DELETE service
router.delete("/:id", remove);

module.exports = router;
