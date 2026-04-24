require("dotenv").config();
const http = require("http");
const connectDB = require("./src/db");
const app = require("./app");

const PORT = process.env.PORT || 4001;

(async () => {
  await connectDB();
  http
    .createServer(app)
    .listen(PORT, () =>
      console.log(`✅  Local server on http://localhost:${PORT}`),
    );
})();
