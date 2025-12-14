const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require('../utils/multer');
// -------------------------
// Auth Routes
// -------------------------
router.post("/google", authController.googleLogin);
router.post("/firebase", authController.firebaseLogin);

// -------------------------
// Profile (Protected Route)
// -------------------------
router.get("/profile", authMiddleware, authController.getProfile);
router.put("/profile/edit", authMiddleware, upload.single("profile_pic"), authController.updateProfile);


// -------------------------
// Customer Management
// -------------------------
router.get("/", authController.getAllUsers);
router.get("/:id", authController.getUserById);
router.delete("/:id", authController.deleteUser);

module.exports = router;
