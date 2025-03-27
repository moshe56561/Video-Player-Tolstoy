require("dotenv").config();
const express = require("express");
const cors = require("cors");

const corsMiddleware = require("./src/middleware/cors");
const errorHandler = require("./src/middleware/errorHandler");
const uploadRoutes = require("./src/routes/uploadRoutes");
const galleryRoutes = require("./src/routes/galleryRoutes");

// Set up express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(corsMiddleware);

// Routes for API
app.use("/api/upload", uploadRoutes);
app.use("/api/gallery", galleryRoutes);

// Error handling middleware
app.use(errorHandler);

// Only start server if not in a serverless environment
if (process.env.NODE_ENV !== "production") {
  const http = require("http");
  const PORT = process.env.PORT || 3001;
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Upload endpoint: POST http://localhost:${PORT}/api/upload`);
    console.log(`Gallery endpoint: GET http://localhost:${PORT}/api/gallery`);
  });
}

// Export only the app for Vercel compatibility
module.exports = app;
