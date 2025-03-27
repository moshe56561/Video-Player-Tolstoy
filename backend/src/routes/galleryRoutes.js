const express = require("express");
const galleryController = require("../controllers/galleryController");

const router = express.Router();

// Gallery endpoint
router.get("/", galleryController.getGallery);

module.exports = router;
