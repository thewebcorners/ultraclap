// controllers/cta.controller.js
const { CtaLog } = require("../models");

exports.trackCTA = async (req, res) => {
  try {
    const { business_id, action } = req.body;
    const user_id = req.user?.id || null;

    await CtaLog.create({
      business_id,
      user_id,
      action,
      ip: req.ip,
      user_agent: req.headers["user-agent"],
    });

    res.json({ success: true });
  } catch (err) {
    console.error("CTA Track Error:", err);
    res.status(500).json({ error: "Failed to track CTA" });
  }
};
