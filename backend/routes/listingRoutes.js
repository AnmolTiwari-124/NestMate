const express = require("express");

const {
  createListing,
  getApprovedListings,
} = require("../controllers/listingController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getApprovedListings);
router.post("/", protect, createListing);

module.exports = router;
