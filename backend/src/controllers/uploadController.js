const { v4: uuidv4 } = require("uuid");
const uploadService = require("../services/uploadService");

// Persistent upload tracking
const uploadStatus = {};

exports.uploadVideos = async (req, res) => {
  const uploadId = uuidv4();
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: "No video files provided" });
  }

  // Initialize upload status
  uploadStatus[uploadId] = {
    uploadId,
    totalFiles: files.length,
    completedFiles: 0,
    overallProgress: 0,
    files: files.map((file) => ({
      filename: file.originalname,
      progress: 0,
      size: file.size,
      url: null,
      thumbnailUrl: null,
    })),
  };

  try {
    // Process the videos (asynchronous operation)
    const uploadedVideos = await uploadService.processVideos(
      files,
      uploadId,
      uploadStatus
    );

    // Final response after upload completion
    res.json({
      uploadId,
      videos: uploadedVideos,
      overallProgress: 100,
    });
  } catch (error) {
    console.error("Upload error:", error);

    // Update status for failed upload
    uploadStatus[uploadId].overallProgress = 0;
    uploadStatus[uploadId].files = uploadStatus[uploadId].files.map((file) => ({
      ...file,
      progress: 0,
      error: error.message,
    }));

    res.status(500).json({
      error: "Video processing failed",
      uploadId,
    });
  }
};

// Polling route to get upload progress (called periodically by client)
exports.getUploadStatus = (req, res) => {
  const { uploadId } = req.query;

  if (!uploadId || !uploadStatus[uploadId]) {
    return res
      .status(404)
      .json({ error: "Upload not found or has completed." });
  }

  res.json(uploadStatus[uploadId]);
};

// Export uploadStatus for potential access
exports.uploadStatus = uploadStatus;
