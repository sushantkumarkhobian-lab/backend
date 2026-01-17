const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

// Load environment variables from .env
dotenv.config();

const app = express();

// ==========================
// MIDDLEWARE
// ==========================
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images

// ==========================
// ROUTES
// ==========================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/issues", require("./routes/issues"));
app.use("/api/notifications", require("./routes/notifications"));

// ==========================
// CONNECT TO MONGODB (Mongoose v7+)
// ==========================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ==========================
// DEFAULT ROUTE
// ==========================
app.get("/", (req, res) => {
  res.send("Smart Civic Backend API is running!");
});

// ==========================
// ERROR HANDLING
// ==========================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// ==========================
// START SERVER
// ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
