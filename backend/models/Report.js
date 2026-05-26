const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
      index: true,
    },

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.pre("validate", function validateTarget(next) {
  if (!this.reportedUser && !this.listing) {
    this.invalidate("reportedUser", "Report must target a user or listing");
  }

  next();
});

module.exports = mongoose.model("Report", reportSchema);
