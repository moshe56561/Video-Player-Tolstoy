require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const corsMiddleware = require("./src/middleware/cors");
const errorHandler = require("./src/middleware/errorHandler");
const uploadRoutes = require("./src/routes/uploadRoutes");
const galleryRoutes = require("./src/routes/galleryRoutes");
const SocketManager = require("./src/utils/socketManager");

const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Adjust to your frontend URL
    methods: ["GET", "POST"],
  },
});

// Initialize SocketManager to handle socket events
SocketManager.init(io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(corsMiddleware);

// Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/gallery", galleryRoutes);

// Socket setup (make sure this is done after SocketManager.init())
require("./src/sockets/uploadSocket")(io);

// Error handling middleware
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Upload endpoint: POST http://localhost:${PORT}/api/upload`);
  console.log(`Gallery endpoint: GET http://localhost:${PORT}/api/gallery`);
});

module.exports = { app, server, io };
