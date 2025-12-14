const express = require("express");
const router = express.Router();
const businessController = require("../controllers/business.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../utils/multer");

// ✅ List businesses (filter, search, rating, sort)
router.get("/", businessController.getAll);

// ✅ Get business by ID
router.get("/:id", businessController.getById);

// ✅ Create business (Auth + image upload)
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  businessController.create
);

// ✅ Update business (Auth + image upload)
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  businessController.update
);

// ✅ Delete business
router.delete("/:id", authMiddleware, businessController.delete);

module.exports = router;
