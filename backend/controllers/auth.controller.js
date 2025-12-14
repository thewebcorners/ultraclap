const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const admin = require("../utils/firebaseAdmin");
const User = require("../models/user.model");
const Business = require("../models/business.model");
const Category = require("../models/category.model");
const Subcategory = require("../models/subcategory.model");
const { Op } = require("sequelize");
const cloudinary = require('../utils/cloudinary');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// -------------------------------
// Utility: Create JWT for app
// -------------------------------
function signAppToken(user) {
  return jwt.sign(
    { id: user.id, mobile: user.mobile, role: user.role || "customer" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// -------------------------------
// Firebase Login (Phone Auth)
// -------------------------------
exports.firebaseLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken)
      return res
        .status(400)
        .json({ success: false, message: "Missing idToken" });

    // 🔹 Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, phone_number } = decoded;

    if (!phone_number)
      return res
        .status(400)
        .json({ success: false, message: "No phone number in token" });

    // 🔹 Check or create user
    let user = await User.findOne({ where: { mobile: phone_number } });

    if (!user) {
      user = await User.create({
        name: phone_number,
        email: null,
        mobile: phone_number,
        role: "customer",
      });
    }

    console.log("✅ Firebase user verified:", user.dataValues);

    const appToken = signAppToken(user);

    // 🔹 Send response
    return res.status(200).json({
      success: true,
      message: "Firebase login successful",
      token: appToken,
      user: {
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Firebase login error:", err);
    return res.status(500).json({
      success: false,
      message: "Firebase login failed",
      error: err.message,
    });
  }
};

// -------------------------------
// Google Sign-In
// -------------------------------
exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: "Missing token" });

    // Verify token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Find or create user
    let user = await User.findOne({
      where: { [Op.or]: [{ email }, { googleId }] },
    });

    if (!user) {
      user = await User.create({
        name: name || email.split("@")[0],
        email,
        googleId,
        role: "customer",
      });
    } else {
      await user.update({
        name: name || user.name,
        googleId,
        profile_pic: picture || user.profile_pic,
      });
    }

    const appToken = signAppToken(user);
    return res.json({
      success: true,
      token: appToken,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Google login error:", err);
    return res
      .status(500)
      .json({ message: "Google login failed", error: err.message });
  }
};

// -------------------------------
// Get Profile (User + Businesses)
// -------------------------------
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    // Fetch user info
    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "mobile", "role","profile_pic", "createdAt"],
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // Fetch businesses owned by this user
    const businesses = await Business.findAll({
      where: { owner_id: userId },
      attributes: ["id", "name", "description","area","state","city","status","cloudinary_image_url","createdAt"],
      include: [
        { model: Category, attributes: ["id", "name"] },
        { model: Subcategory, attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      user,
      businesses: businesses.map((biz) => ({
        id: biz.id,
        name: biz.name,
        description: biz.description,
        category: biz.Category?.name || null,
        subcategory: biz.Subcategory?.name || null,
        area:biz.area || null,
        city:biz.city,
        state:biz.state,
        cloudinary_image_url:biz.cloudinary_image_url,
        createdAt: biz.createdAt,
      })),
    });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: err.message,
    });
  }
};

// -------------------------------
// Get All Users (Search + Pagination)
// -------------------------------
exports.getAllUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;

    const where = {};
    if (role) where.role = role;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { mobile: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows: users } = await User.findAndCountAll({
      where,
      order: [["id", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: ["id", "name", "email", "mobile", "role", "createdAt"],
    });

    res.json({
      success: true,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      users,
    });
  } catch (err) {
    console.error("Get all users error:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
};

// -------------------------------
// Get Single User by ID
// -------------------------------
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "name", "email", "mobile", "role", "createdAt"],
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    console.error("Get user by ID error:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch user", error: err.message });
  }
};

// -------------------------------
// Delete User
// -------------------------------
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res
      .status(500)
      .json({ message: "Failed to delete user", error: err.message });
  }
};
// Update logged-in user's profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, mobile, status } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let profile_pic = user.profile_pic;

    if (req.file) {
      // Upload image from buffer to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "users/profile_pics" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      profile_pic = uploadResult.secure_url;
    }

    await user.update({
      name,
      email,
      mobile,
      status,
      profile_pic,
    });

    res.json({ success: true, message: "Profile updated ✅", user });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
