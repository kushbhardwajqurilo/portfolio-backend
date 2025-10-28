const express = require("express");
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
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/visitor", router);

// simple browser UI
app.get("/", (req, res) => {
  res.send(`<html><body style="display:flex;justify-content:center;align-items:center;height:100vh;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-family:sans-serif">
              <div><h1>🚀 Portfolio Server Running</h1>
              <p>Your backend is live on Vercel.</p></div>
            </body></html>`);
});

module.exports = app;
