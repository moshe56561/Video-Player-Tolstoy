require("dotenv").config();
const express = require("express");
const cors = require("cors");

const uploadRoutes = require("./src/routes/uploadRoutes");
const galleryRoutes = require("./src/routes/galleryRoutes");

// Set up express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/upload", uploadRoutes);
app.use("/api/gallery", galleryRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
