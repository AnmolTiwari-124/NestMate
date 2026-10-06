const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    type: {
      type: String,
      enum: ["room", "pg", "flat", "hostel"],
      default: "pg",
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    rent: {
      type: Number,
      required: true,
      min: 0,
    },

    amenities: [
      {
        type: String,
        trim: true,
      },
    ],

    images: [
      {
        type: String,
        trim: true,
      },
    ],

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  }
);

listingSchema.index({
  title: "text",
  description: "text",
  location: "text",
});

module.exports = mongoose.model("Listing", listingSchema);
