// configs/db.js
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const connection = mongoose.connect(process.env.dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // avoid hanging if the connection fails
  tls: true, // required for Atlas SSL connections
});

connection
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

module.exports = { connection };
