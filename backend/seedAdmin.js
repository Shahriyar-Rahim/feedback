// One-off script to create/update admin accounts from .env
// Run with: node seedAdmin.js

import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import Admin from "./src/models/Admin.js";
import mongoose from "mongoose";

dotenv.config();

const admins = [
  {
    email: process.env.ADMIN1_EMAIL,
    password: process.env.ADMIN1_PASSWORD,
  },
  {
    email: process.env.ADMIN2_EMAIL,
    password: process.env.ADMIN2_PASSWORD,
  },
];

const run = async () => {
  await connectDB();

  for (const adminData of admins) {
    const { email, password } = adminData;

    if (!email || !password) {
      console.log(`Skipping admin because email/password missing`);
      continue;
    }

    let admin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (admin) {
      admin.password = password;

      await admin.save();

      console.log(`Updated admin password: ${email}`);
    } else {
      await Admin.create({
        email: email.toLowerCase(),
        password,
      });

      console.log(`Created admin: ${email}`);
    }
  }

  await mongoose.disconnect();

  process.exit(0);
};

run();
