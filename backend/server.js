const express = require("express");
const cors = require("cors");

const corsMiddleware = require("../src/middleware/cors");
const errorHandler = require("../src/middleware/errorHandler");
const uploadRoutes = require("../src/routes/uploadRoutes");
const galleryRoutes = require("../src/routes/galleryRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(corsMiddleware);

app.use("/api/upload", uploadRoutes);
app.use("/api/gallery", galleryRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running on Vercel");
});

app.use(errorHandler);

module.exports = app;
