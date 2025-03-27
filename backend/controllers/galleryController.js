const blobService = require("../services/blobService");

exports.getGallery = async (req, res) => {
  try {
    const galleryData = await blobService.getGalleryItems();
    res.json(galleryData);
  } catch (error) {
    console.error("Gallery error:", error);
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
};
