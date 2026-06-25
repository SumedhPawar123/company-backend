require("dotenv").config();
const mongoose = require("mongoose");

const Admin = require("../models/Admin"); // Update path if needed

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await Admin.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    const admin = await Admin.create({
      fullName: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD, // Will be hashed by pre-savde hook
      role: "admin"
    });

    console.log("Admin created successfully!");
    console.log({
      id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
    });

    process.exit(0);
  } catch (error) {
    console.error(" Error:", error.message);
    process.exit(1);
  }
};

seedAdmin();