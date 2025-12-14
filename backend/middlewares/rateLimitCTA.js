// middleware/rateLimitCTA.js
const rateLimit = require("express-rate-limit");

exports.ctaLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5, // 5 calls per hour per IP
  message: "Too many requests — try again later.",
});
