const express = require("express");

const {
  getDashboardStats,
  getUsers,
  getUserById,
  deleteUser,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.get("/stats", getDashboardStats);

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);

module.exports = router;
