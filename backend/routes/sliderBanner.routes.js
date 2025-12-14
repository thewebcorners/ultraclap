// routes/sliderBanner.routes.js
const express = require("express");
const router = express.Router();
const upload = require('../utils/multer');
const controller = require("../controllers/sliderBanner.controller");

// GET all
router.get("/", controller.getAll);

// GET one
router.get("/:id", controller.getById);

// CREATE (multipart/form-data) — field name "image"
router.post("/", upload.single("image"), controller.create);

// UPDATE (optional image)
router.put("/:id", upload.single("image"), controller.update);

// DELETE
router.delete("/:id", controller.remove);

module.exports = router;
