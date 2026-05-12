const express = require("express");

const {
  getAllUsers,
  registerUser,
  loginUser,
  getMe,
  updateProfile,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Route
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.get("/users", protect, getAllUsers);

module.exports = router;