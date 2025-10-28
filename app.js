const express = require("express");
const cors = require("cors");
const router = require("./src/router");

const app = express();
const allowedOrigins = [
  "https://my-portfolio-two-gamma-22.vercel.app",
  "https://4frnn03l-5173.inc1.devtunnels.ms",
  "http://localhost:5173",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type , Authorization ,X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/visitor", router);

module.exports = app;
