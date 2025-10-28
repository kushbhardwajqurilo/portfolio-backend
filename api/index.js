require("dotenv").config();
const app = require("../app");
const connectDB = require("../src/db");

let connected = false;

module.exports = async (req, res) => {
  if (!connected) {
    await connectDB(); // connect once per cold start
    connected = true;
  }
  return app(req, res); // delegate to Express
};
