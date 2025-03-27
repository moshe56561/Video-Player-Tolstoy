require("dotenv").config();
const express = require("express");
const cors = require("cors");

const corsMiddleware = require("./src/middleware/cors");
const errorHandler = require("./src/middleware/errorHandler");
const uploadRoutes = require("./src/routes/uploadRoutes");
const galleryRoutes = require("./src/routes/galleryRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(corsMiddleware);

// Routes for API
app.use("/api/upload", uploadRoutes);
app.use("/api/gallery", galleryRoutes);

// Root route for health check
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
