require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/user");

const ADMIN_NAME = "Admin";
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "Password123!";

async function seedAdmin() {
  if (!process.env.mongoUri) {
    throw new Error("mongoUri is missing in .env");
  }

  await connectDB(process.env.mongoUri);

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const existingUser = await User.findOne({ email: ADMIN_EMAIL });

  if (existingUser) {
    existingUser.name = existingUser.name || ADMIN_NAME;
    existingUser.password = hashedPassword;
    existingUser.role = "admin";
    await existingUser.save();

    console.log("Admin user updated successfully.");
  } else {
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin user created successfully.");
  }
}

seedAdmin()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error("Failed to seed admin:", err.message);
    await mongoose.disconnect();
    process.exit(1);
  });
