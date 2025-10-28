// api/index.js
require("dotenv").config();
const app = require("../app");
const connectDB = require("../src/db");

let isConnected = false; // keep across invocations (warm reuse)

async function ensureDB() {
  if (isConnected) return;
  await connectDB();
  isConnected = true;
}

module.exports = async (req, res) => {
  try {
    // Connect DB only once per cold start
    await ensureDB();

    // Forward request to Express app
    return app(req, res);
  } catch (err) {
    console.error("Serverless handler error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
