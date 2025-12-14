const express = require("express");
const router = express.Router();
const articleController = require("../controllers/article.controller");
const upload = require('../utils/multer');

router.get("/", articleController.getAll);
router.get("/:id", articleController.getById);
router.get("/slug/:slug", articleController.getArticleBySlug);
router.post("/", upload.single("thumbnail"), articleController.create);
router.put("/:id", upload.single("thumbnail"), articleController.update);
router.delete("/:id", articleController.delete);

module.exports = router;
