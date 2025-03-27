require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");

const corsMiddleware = require("./src/middleware/cors");
const errorHandler = require("./src/middleware/errorHandler");
const uploadRoutes = require("./src/routes/uploadRoutes");
const galleryRoutes = require("./src/routes/galleryRoutes");

// Set up HTTP server and express app
const PORT = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(corsMiddleware);

// Routes for API
app.use("/api/upload", uploadRoutes);
app.use("/api/gallery", galleryRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Upload endpoint: POST http://localhost:${PORT}/api/upload`);
  console.log(`Gallery endpoint: GET http://localhost:${PORT}/api/gallery`);
});

module.exports = { app, server };
