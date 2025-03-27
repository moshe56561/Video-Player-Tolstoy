const { v4: uuidv4 } = require("uuid");
const uploadService = require("../services/uploadService");
const SocketManager = require("../utils/socketManager");

// Persistent upload tracking
const uploadStatus = {};

exports.uploadVideos = async (req, res) => {
  const uploadId = uuidv4();
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: "No video files provided" });
  }

  // Get io from the SocketManager
  const io = SocketManager.getIO();

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

  // Emit initial upload status via socket
  SocketManager.emitUploadProgress(uploadId, uploadStatus[uploadId]);

  try {
    const uploadedVideos = await uploadService.processVideos(
      files,
      uploadId,
      uploadStatus,
      io
    );

    // Final response
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

    // Emit final error status
    SocketManager.getIO().emit("upload_status", uploadStatus[uploadId]);

    // Clear the upload status after a delay
    setTimeout(() => {
      delete uploadStatus[uploadId];
    }, 5000);

    res.status(500).json({
      error: "Video processing failed",
      uploadId,
    });
  }
};

// Export uploadStatus for potential socket access
exports.uploadStatus = uploadStatus;
