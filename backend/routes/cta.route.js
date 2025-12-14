// routes/cta.route.js
const express = require("express");
const router = express.Router();
const { trackCTA } = require("../controllers/cta.controller");
const ctaLimiter = require("../middlewares/rateLimitCTA");
router.post("/", ctaLimiter,trackCTA);
module.exports = router;
