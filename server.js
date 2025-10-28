require("dotenv").config({});
const express = require("express");
const http = require("http");
const connectDB = require("./src/db");

const app = express();

// ✅ Root route with cool UI
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Server Status</title>
        <style>
          body {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            font-family: 'Poppins', sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          h1 {
            font-size: 3rem;
            margin: 0;
            animation: pulse 2s infinite;
          }
          p {
            font-size: 1.2rem;
            opacity: 0.9;
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          .status {
            background: rgba(255,255,255,0.1);
            padding: 20px 40px;
            border-radius: 15px;
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
            text-align: center;
          }
          footer {
            position: absolute;
            bottom: 10px;
            font-size: 0.9rem;
            opacity: 0.7;
          }
        </style>
      </head>
      <body>
        <div class="status">
          <h1>🚀Poortfolio Server Running </h1>
          <p>Everything looks good! Your backend is live and connected.</p>
        </div>
        <footer>Powered by <strong>Node.js + Express</strong></footer>
      </body>
    </html>
  `);
});

// ✅ Set Port
const PORT =
  process.env.NODE_ENV === "production" ? process.env.PORT || 4001 : 4001;

// ✅ Start Server
async function startServer() {
  try {
    await connectDB();
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
  }
}

startServer();
