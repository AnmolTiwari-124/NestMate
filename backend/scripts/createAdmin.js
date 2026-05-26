const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const createAdmin = async () => {
  try {
    const name = process.env.ADMIN_NAME || "NestMate Admin";
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is required");
    }

    if (!email || !password) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
    }

    if (password.length < 6) {
      throw new Error("ADMIN_PASSWORD must be at least 6 characters");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      existingAdmin.role = "admin";
      existingAdmin.isActive = true;
      await existingAdmin.save();

      console.log(`Admin already exists and is active: ${email}`);
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log(`Admin account created: ${email}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
