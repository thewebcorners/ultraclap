// controllers/sliderBanner.controller.js
const SliderBanner = require("../models/SliderBanner");
const cloudinary = require("../utils/cloudinary");

// GET all banners
exports.getAll = async (req, res) => {
  try {
    const banners = await SliderBanner.findAll({
      order: [["display_order", "ASC"], ["id", "DESC"]],
    });
    res.json(banners);
  } catch (err) {
    console.error("Error fetching banners:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET single banner
exports.getById = async (req, res) => {
  try {
    const banner = await SliderBanner.findByPk(req.params.id);
    if (!banner) return res.status(404).json({ message: "Not found" });
    res.json(banner);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// CREATE banner
exports.create = async (req, res) => {
  try {
    const { title, redirect_url, is_active, display_order } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // upload buffer to cloudinary
    const result = await cloudinary.uploader.upload_stream_async
      ? await uploadStreamPromise(req.file)
      : await uploadBuffer(req.file);

    // result: { secure_url, public_id }
    const banner = await SliderBanner.create({
      title,
      image_url: result.secure_url,
      public_id: result.public_id,
      redirect_url: redirect_url || null,
      is_active: is_active === "true" || is_active === true,
      display_order: display_order ? Number(display_order) : 0,
    });

    res.status(201).json(banner);
  } catch (err) {
    console.error("Error creating banner:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE banner
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const banner = await SliderBanner.findByPk(id);
    if (!banner) return res.status(404).json({ message: "Not found" });

    const { title, redirect_url, is_active, display_order } = req.body;

    // If a new file provided, upload and delete old one
    if (req.file) {
      // upload new
      const result = await uploadBuffer(req.file);

      // delete old from cloudinary if public_id present
      if (banner.public_id) {
        try {
          await cloudinary.uploader.destroy(banner.public_id);
        } catch (e) {
          console.warn("Cloudinary delete failed:", e.message || e);
        }
      }

      banner.image_url = result.secure_url;
      banner.public_id = result.public_id;
    }

    banner.title = title !== undefined ? title : banner.title;
    banner.redirect_url = redirect_url !== undefined ? redirect_url : banner.redirect_url;
    banner.is_active = is_active === undefined ? banner.is_active : (is_active === "true" || is_active === true);
    banner.display_order = display_order !== undefined ? Number(display_order) : banner.display_order;

    await banner.save();

    res.json(banner);
  } catch (err) {
    console.error("Error updating banner:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE banner
exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const banner = await SliderBanner.findByPk(id);
    if (!banner) return res.status(404).json({ message: "Not found" });

    // delete from cloudinary
    if (banner.public_id) {
      try {
        await cloudinary.uploader.destroy(banner.public_id);
      } catch (e) {
        console.warn("Cloudinary delete failed:", e.message || e);
      }
    }

    await banner.destroy();
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Error deleting banner:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Helper: upload buffer to cloudinary via upload_stream
function uploadBuffer(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "slider_banners" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(file.buffer);
  });
}
