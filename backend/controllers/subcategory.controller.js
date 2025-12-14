const { Subcategory,Category } = require('../models');
const cloudinary = require('../utils/cloudinary');

exports.getAll = async (req, res) => {
  try { const data = await Subcategory.findAll(); res.json(data); } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getById = async (req, res) => {
  try { const data = await Subcategory.findByPk(req.params.id); res.json(data); } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getSubcategoriesByCategory = async (req, res) => {
  try {
    const categorySlug = req.params.category;
    const categoryName = categorySlug.replace(/-/g, " ");
    if (!categoryName) {
      return res.status(400).json({ error: "Category slug is required" });
    }

    const foundCategory = await Category.findOne({
      where: { name: categoryName },
      attributes: ["id", "name"],
    });

    if (!foundCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    const subcategories = await Subcategory.findAll({
      where: { category_id: foundCategory.id },
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    res.json(subcategories);
  } catch (err) {
    console.error("Error fetching subcategories:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.create = async (req, res) => {
  try {
    const data = req.body;

    // Handle file upload
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'subcategorys' },
          (err, res) => {
            if (err) reject(err);
            else resolve(res);
          }
        );
        stream.end(req.file.buffer);
      });
      data.icon_svg = result.secure_url; // match frontend field name
    }

    const obj = await Subcategory.create(data);
    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const obj = await Subcategory.findByPk(req.params.id);
    if (!obj) return res.status(404).json({ message: 'Not found' });

    const data = req.body;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'subcategorys' },
          (err, res) => {
            if (err) reject(err);
            else resolve(res);
          }
        );
        stream.end(req.file.buffer);
      });
      data.icon_svg = result.secure_url; // match frontend field name
    }

    await obj.update(data);
    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.delete = async (req, res) => {
  try {
    const obj = await Subcategory.findByPk(req.params.id);
    if (!obj) return res.status(404).json({ message: 'Not found' });
    await obj.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
