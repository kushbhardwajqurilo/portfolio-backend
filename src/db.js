require("dotenv").config({});
const mongoose = require("mongoose");

let isConnected = false; // Global connection state

async function connectDB() {
  if (isConnected) {
    console.log("⚡ Using existing MongoDB connection");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10s timeout
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log(`DataBase Connected`);
  } catch (err) {
    console.error("DataBase connection error:", err.message);
    process.exit(1); // stop app if DB fails in production
  }
}

module.exports = connectDB;
