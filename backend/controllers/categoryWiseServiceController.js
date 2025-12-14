const { CategoryWiseService, Category, Subcategory } = require("../models");

// ==========================
// ✅ GET ALL SERVICES
// ==========================
exports.getAll = async (req, res) => {
  try {
    const services = await CategoryWiseService.findAll({
      include: [
        { model: Category, attributes: ["id", "name"] },
        { model: Subcategory, attributes: ["id", "name"] },
      ],
      order: [["id", "DESC"]],
    });

    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ==========================
// ✅ GET SINGLE SERVICE
// ==========================
exports.getById = async (req, res) => {
  try {
    const service = await CategoryWiseService.findByPk(req.params.id, {
      include: [
        { model: Category, attributes: ["id", "name"] },
        { model: Subcategory, attributes: ["id", "name"] },
      ],
    });

    if (!service)
      return res.status(404).json({ message: "Service not found" });

    res.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ==========================
// ✅ CREATE SERVICE
// ==========================
exports.create = async (req, res) => {
  try {
    const { service_name, slug, category_id, subcategory_id, is_active } =
      req.body;

    const newService = await CategoryWiseService.create({
      service_name,
      slug,
      category_id,
      subcategory_id,
      is_active,
    });

    res.status(201).json(newService);
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ==========================
// ✅ UPDATE SERVICE
// ==========================
exports.update = async (req, res) => {
  try {
    const { service_name, slug, category_id, subcategory_id, is_active } =
      req.body;

    const service = await CategoryWiseService.findByPk(req.params.id);

    if (!service)
      return res.status(404).json({ message: "Service not found" });

    await service.update({
      service_name,
      slug,
      category_id,
      subcategory_id,
      is_active,
    });

    res.json(service);
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ==========================
// ✅ DELETE SERVICE
// ==========================
exports.remove = async (req, res) => {
  try {
    const service = await CategoryWiseService.findByPk(req.params.id);

    if (!service)
      return res.status(404).json({ message: "Service not found" });

    await service.destroy();
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ error: "Server error" });
  }
};
