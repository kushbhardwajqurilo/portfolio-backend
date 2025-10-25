const express = require("express");
const cors = require("cors");
const router = require("./src/router");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "https://my-portfolio-two-gamma-22.vercel.app",
      "https://4frnn03l-5173.inc1.devtunnels.ms",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

app.use("/visitor", router);

module.exports = app;
