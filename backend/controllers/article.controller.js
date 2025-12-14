const { Article, Category, Subcategory, Business } = require("../models");
const cloudinary = require("../utils/cloudinary");

// ✅ Get all articles
exports.getAll = async (req, res) => {
  try {
    const data = await Article.findAll({
      include: [
        { model: Category, as: "Category", required: false },
        { model: Subcategory, as: "Subcategory", required: false },
        { model: Business, as: "Business", required: false },
      ],
      order: [["id", "DESC"]],
    });
    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Article getAll error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get article by slug
exports.getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await Article.findOne({
      where: { slug },
      include: [
        { model: Category, as: "Category", required: false },
        { model: Subcategory, as: "Subcategory", required: false },
        { model: Business, as: "Business", required: false },
      ],
    });

    if (!article) return res.status(404).json({ message: "Article not found" });

    res.status(200).json(article);
  } catch (err) {
    console.error("❌ Article getArticleBySlug error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get article by ID
exports.getById = async (req, res) => {
  try {
    const data = await Article.findByPk(req.params.id, {
      include: [
        { model: Category, as: "Category", required: false },
        { model: Subcategory, as: "Subcategory", required: false },
        { model: Business, as: "Business", required: false },
      ],
    });

    if (!data) return res.status(404).json({ message: "Article not found" });

    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Article getById error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Create new article
exports.create = async (req, res) => {
  try {
    const data = req.body;
    let imageUrl = null;
    let publicId = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "articles" },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        uploadStream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
      publicId = result.public_id;
    }

    const slug = data.title
      ? data.title.toLowerCase().trim().replace(/\s+/g, "-")
      : `article-${Date.now()}`;

    const article = await Article.create({
      title: data.title,
      slug,
      content: data.content,
      category_id: data.category_id || null,
      subcategory_id: data.subcategory_id || null,
      business_id: data.business_id || null,
      thumbnail_url: imageUrl,
      thumbnail_public_id: publicId,
      status: data.status || "draft",
    });

    res.status(201).json({
      success: true,
      message: "Article created successfully",
      data: article,
    });
  } catch (err) {
    console.error("❌ Article create error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update article
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const obj = await Article.findByPk(id);

    if (!obj) return res.status(404).json({ message: "Article not found" });

    const data = req.body;
    let imageUrl = obj.thumbnail_url;
    let publicId = obj.thumbnail_public_id;

    if (req.file) {
      if (obj.thumbnail_public_id) {
        await cloudinary.uploader.destroy(obj.thumbnail_public_id);
      }

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "articles" },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        uploadStream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
      publicId = result.public_id;
    }

    await obj.update({
      title: data.title ?? obj.title,
      content: data.content ?? obj.content,
      category_id: data.category_id ?? obj.category_id,
      subcategory_id: data.subcategory_id ?? obj.subcategory_id,
      business_id: data.business_id ?? obj.business_id,
      thumbnail_url: imageUrl,
      thumbnail_public_id: publicId,
      status: data.status ?? obj.status,
    });

    res.status(200).json({
      success: true,
      message: "Article updated successfully",
      data: obj,
    });
  } catch (err) {
    console.error("❌ Article update error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete article
exports.delete = async (req, res) => {
  try {
    const obj = await Article.findByPk(req.params.id);

    if (!obj) return res.status(404).json({ message: "Article not found" });

    if (obj.thumbnail_public_id) {
      await cloudinary.uploader.destroy(obj.thumbnail_public_id);
    }

    await obj.destroy();
    res.status(200).json({ success: true, message: "Article deleted successfully" });
  } catch (err) {
    console.error("❌ Article delete error:", err);
    res.status(500).json({ error: err.message });
  }
};
