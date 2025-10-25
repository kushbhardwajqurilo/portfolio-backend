require("dotenv").config({});
const app = require("./app");
const http = require("http");

const connectDB = require("./src/db");
const PORT = process.env.NODE_ENV === "production" ? process.env.BaseURL : 4001;

async function startServer() {
  await connectDB();
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log("server running");
  });
}

startServer();
