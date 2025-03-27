const express = require("express");
const multer = require("multer");
const uploadController = require("../controllers/uploadController");
const fileValidation = require("../utils/fileValidation");

const router = express.Router();

// Configure Multer memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 55 * 1024 * 1024 }, // 50MB
  fileFilter: fileValidation.videoFileFilter,
});

// Upload endpoint
router.post("/", upload.array("videos"), uploadController.uploadVideos);

module.exports = router;
