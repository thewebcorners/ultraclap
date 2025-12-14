const { Op, fn, col, literal } = require("sequelize");
const { Business, Category, Review, User, BusinessContact } = require("../models");
const cloudinary = require("../utils/cloudinary");

// ============================
// GET ALL BUSINESSES
// ============================
exports.getAll = async (req, res) => {
  try {
    const { city, category, keyword, location, sort } = req.query;

    let where = {};
    let include = [];

    // Filter — City
    if (city) where.city = city;

    // Filter — Category
    include.push({
      model: Category,
      attributes: ["id", "name"],
      ...(category && { where: { name: category } }),
      required: !!category,
    });

    // Include Reviews for rating calculation
    include.push({
      model: Review,
      attributes: [],
    });

    // Include business owner phone
    include.push({
      model: User,
      attributes: ["id", "mobile"],
      required: false,
    });

    // Keyword search
    if (keyword) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${keyword}%` } },
        { description: { [Op.iLike]: `%${keyword}%` } },
        { area: { [Op.iLike]: `%${keyword}%` } },
        { city: { [Op.iLike]: `%${keyword}%` } },
      ];
    }

    // Location search
    if (location) {
      where.city = { [Op.iLike]: `%${location}%` };
    }

    // Sorting
    let order = [["id", "DESC"]];
    if (sort === "name_asc") order = [["name", "ASC"]];
    if (sort === "name_desc") order = [["name", "DESC"]];
    if (sort === "rating_desc") order = [[literal("rating"), "DESC"]];
    if (sort === "rating_asc") order = [[literal("rating"), "ASC"]];

    // Fetch with rating aggregation
    const businesses = await Business.findAll({
      where,
      include,
      attributes: {
        include: [[fn("COALESCE", fn("AVG", col("Reviews.rating")), 0), "rating"]],
      },
      group: ["Business.id", "Category.id", "User.id"],
      order,
    });

    // Format Response
    const formatted = businesses.map((b) => ({
      id: b.id,
      name: b.name,
      description: b.description,
      area: b.area,
      city: b.city,
      state: b.state,
      rating: Number(b.get("rating")),
      phone: b.User?.mobile || null,
      image: b.cloudinary_image_url || "https://dummyimage.com/600x400/cccccc/000000",
      category: b.Category?.name || null,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ============================
// GET BUSINESS BY ID
// ============================
exports.getById = async (req, res) => {
  try {
    const data = await Business.findByPk(req.params.id, {
      include: [
        { model: Category, attributes: ["id", "name"] },
        { model: BusinessContact, attributes: ["id", "contact_type", "contact_value", "extra_json"] },
        { model: User, attributes: ["id","name","mobile"] },
      ],
    });

    if (!data) return res.status(404).json({ message: "Business not found" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// CREATE BUSINESS
// ============================
exports.create = async (req, res) => {
  try {
    const {
      name,
      description,
      category_id,
      subcategory_id,
      pincode,
      plot,
      building,
      street,
      landmark,
      area,
      city,
      state,
      status,
      contacts, // optional: array of contacts with extra_json
    } = req.body;

    const owner_id = req.user?.id;
    if (!owner_id) return res.status(401).json({ message: "Unauthorized: No owner ID" });

    const businessData = {
      name,
      description,
      category_id,
      subcategory_id,
      pincode,
      plot,
      building,
      street,
      landmark,
      area,
      city,
      state,
      status,
      owner_id,
    };

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "businesses" },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(req.file.buffer);
      });

      businessData.cloudinary_image_url = uploadResult.secure_url;
    }

    const newBusiness = await Business.create(businessData);

    // ✅ Save business contacts if provided
    if (contacts && Array.isArray(contacts)) {
      for (const c of contacts) {
        await BusinessContact.create({
          business_id: newBusiness.id,
          contact_type: c.contact_type,
          contact_value: c.contact_value,
          extra_json: c.extra_json || null,
        });
      }
    }

    res.json(newBusiness);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// UPDATE BUSINESS
// ============================
exports.update = async (req, res) => {
  try {
    const business = await Business.findByPk(req.params.id);
    if (!business) return res.status(404).json({ message: "Business not found" });

    const { contacts, ...updateData } = req.body;

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "businesses" },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(req.file.buffer);
      });
      updateData.cloudinary_image_url = uploadResult.secure_url;
    }

    await business.update(updateData);

    // ✅ Update or create contacts
    if (contacts && Array.isArray(contacts)) {
      for (const c of contacts) {
        if (c.id) {
          // update existing
          await BusinessContact.update(
            { contact_type: c.contact_type, contact_value: c.contact_value, extra_json: c.extra_json || null },
            { where: { id: c.id, business_id: business.id } }
          );
        } else {
          // create new
          await BusinessContact.create({
            business_id: business.id,
            contact_type: c.contact_type,
            contact_value: c.contact_value,
            extra_json: c.extra_json || null,
          });
        }
      }
    }

    res.json(business);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// DELETE BUSINESS
// ============================
exports.delete = async (req, res) => {
  try {
    const business = await Business.findByPk(req.params.id);
    if (!business) return res.status(404).json({ message: "Business not found" });

    // Delete contacts first
    await BusinessContact.destroy({ where: { business_id: business.id } });

    await business.destroy();
    res.json({ message: "Business deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
