const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    bannedAt: {
      type: Date,
    },

    banReason: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    lastLogin: {
      type: Date,
    },

    age: {
      type: Number,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    occupation: {
      type: String,
    },

    bio: {
      type: String,
      maxlength: 300,
    },

    budget: {
      type: Number,
    },

    location: {
      type: String,
    },

    profileImage: {
      type: String,
    },

    habits: {
      sleepTime: {
        type: String,
      },

      cleanliness: {
        type: String,
      },

      smoking: {
        type: Boolean,
        default: false,
      },

      drinking: {
        type: Boolean,
        default: false,
      },

      foodPreference: {
        type: String,
      },
    },

    personality: {
      type: String,
      enum: ["introvert", "extrovert", "ambivert"],
    },

    hobbies: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);

// age
// gender
// occupation
// bio
// location
// sleepTime
// cleanliness
// smoking
// drinking
// foodPreference

// These are VERY important for AI roommate matching.
