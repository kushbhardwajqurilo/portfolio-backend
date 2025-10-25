const express = require("express");
const cors = require("cors");
const router = require("./src/router");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://my-portfolio-two-gamma-22.vercel.app/",
    ],
    methods: ["POST"],
    credentials: true,
  })
);

app.use(`/visitor`, router);
module.exports = app;
