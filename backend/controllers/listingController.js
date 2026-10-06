const Listing = require("../models/Listing");

const createListing = async (req, res) => {
  try {
    const { title, description, type, location, rent, amenities, images } =
      req.body;

    if (!title || !description || !location || rent === undefined) {
      return res.status(400).json({
        message: "Title, description, location, and rent are required",
      });
    }

    const listing = await Listing.create({
      owner: req.user._id,
      title,
      description,
      type,
      location,
      rent,
      amenities: Array.isArray(amenities) ? amenities : [],
      images: Array.isArray(images) ? images : [],
    });

    res.status(201).json({
      message: "Listing submitted for approval",
      listing,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getApprovedListings = async (req, res) => {
  try {
    const filter = { status: "approved" };

    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
        { location: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const listings = await Listing.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createListing,
  getApprovedListings,
};
