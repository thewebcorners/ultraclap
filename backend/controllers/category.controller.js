const { Category } = require('../models');
const cloudinary = require('../utils/cloudinary');

exports.getAll = async (req, res) => {
  try { const data = await Category.findAll(); res.json(data); } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getById = async (req, res) => {
  try { const data = await Category.findByPk(req.params.id); res.json(data); } catch (err) { res.status(500).json({ error: err.message }); }
};
// ✅ Get categories by type (Service / Business / etc.)
exports.getByType = async (req, res) => {
  try {
    // Get `type` from the URL parameter (e.g., /api/categories/by-type/Service)
    const { type } = req.params;

    if (!type) {
      return res.status(400).json({ error: "Missing 'type' parameter" });
    }

    // Fetch categories by cat_type (make sure column name matches your DB)
    const data = await Category.findAll({
      where: { cat_type: type },
      order: [["id", "ASC"]],
    });

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No categories found for this type" });
    }

    // Success response
    res.status(200).json(data);
  } catch (err) {
    console.error("getByType error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;

    // Handle file upload (field name should match your form input)
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "categories" },
          (err, res) => {
            if (err) reject(err);
            else resolve(res);
          }
        );
        stream.end(req.file.buffer);
      });
      data.icon_url = result.secure_url; // store uploaded image URL
    }

    // Ensure boolean fields are properly parsed
    data.is_popular = data.is_popular === "true" || data.is_popular === true;
    data.is_trending = data.is_trending === "true" || data.is_trending === true;

    // Create category record in DB
    const obj = await Category.create({
      name: data.name,
      description: data.description,
      type: data.type, // 'product' or 'service'
      is_popular: data.is_popular,
      is_trending: data.is_trending,
      icon_svg: data.icon_url,
      cat_type:data.cat_type
    });

    res.json(obj);
  } catch (err) {
    console.error("Category create error:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const obj = await Category.findByPk(id);
    if (!obj) return res.status(404).json({ message: "Category not found" });

    const data = req.body;

    // Handle file upload (icon_svg)
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "categories" },
          (err, res) => {
            if (err) reject(err);
            else resolve(res);
          }
        );
        stream.end(req.file.buffer);
      });
      data.icon_url = result.secure_url;
    }

    // Convert boolean values properly
    if (data.is_popular !== undefined)
      data.is_popular = data.is_popular === "true" || data.is_popular === true;

    if (data.is_trending !== undefined)
      data.is_trending = data.is_trending === "true" || data.is_trending === true;

    // Update allowed fields
    await obj.update({
      name: data.name ?? obj.name,
      description: data.description ?? obj.description,
      type: data.type ?? obj.type,
      is_popular: data.is_popular ?? obj.is_popular,
      is_trending: data.is_trending ?? obj.is_trending,
      icon_svg: data.icon_url ?? obj.icon_url,
      cat_type:data.cat_type ?? obj.cat_type,
    });

    res.json({ message: "Category updated successfully", data: obj });
  } catch (err) {
    console.error("Category update error:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.delete = async (req, res) => {
  try {
    const obj = await Category.findByPk(req.params.id);
    if (!obj) return res.status(404).json({ message: 'Not found' });
    await obj.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
