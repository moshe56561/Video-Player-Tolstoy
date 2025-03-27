const { v4: uuidv4 } = require("uuid");
const thumbnailService = require("./thumbnailService");
const blobService = require("./blobService");

// Debounce function to control the frequency of emitted events
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

exports.processVideos = async (files, uploadId, uploadStatus, io) => {
  const uploadPromises = files.map(async (file, index) => {
    return new Promise(async (resolve, reject) => {
      const currentUuid = uuidv4();
      const videoBuffer = file.buffer;
      const videoExtension = file.originalname.split(".").pop();
      const videoFilename = `video-${currentUuid}.${videoExtension}`;
      const thumbnailFilename = `thumb-${currentUuid}.jpg`;

      try {
        // Debounced progress handler to avoid emitting too frequently
        const debouncedEmitProgress = debounce(() => {
          // Emit updated progress status
          io.emit("upload_progress", {
            uploadId: uploadId,
            ...uploadStatus[uploadId],
          });
        }, 500); // Emits every 500ms at most

        const progressHandler = (progressEvent) => {
          const percentCompleted = progressEvent.percentage;
          uploadStatus[uploadId].files[index].progress = percentCompleted;
          uploadStatus[uploadId].overallProgress = percentCompleted;

          // Call debounced emit function
          debouncedEmitProgress();
        };

        // Generate and optimize thumbnail first
        const thumbnailBuffer = await thumbnailService.generateThumbnail(
          videoBuffer
        );
        const optimizedThumbnail = await thumbnailService.optimizeThumbnail(
          thumbnailBuffer
        );

        // Upload video and thumbnail with progress tracking
        const [videoBlob, thumbnailBlob] = await Promise.all([
          blobService.uploadBlob(videoFilename, videoBuffer, progressHandler),
          blobService.uploadBlob(thumbnailFilename, optimizedThumbnail),
        ]);

        // Finalize progress for this file
        uploadStatus[uploadId].files[index] = {
          ...uploadStatus[uploadId].files[index],
          progress: 100,
          url: videoBlob.url,
          thumbnailUrl: thumbnailBlob.url,
        };

        uploadStatus[uploadId].completedFiles++;

        // Emit final progress update
        io.emit("upload_status", uploadStatus[uploadId]);

        resolve({
          url: videoBlob.url,
          thumbnailUrl: thumbnailBlob.url,
          filename: file.originalname,
          size: file.size,
        });
      } catch (error) {
        console.error(`Upload error for file ${file.originalname}:`, error);

        uploadStatus[uploadId].files[index] = {
          ...uploadStatus[uploadId].files[index],
          progress: 0,
          error: error.message,
        };

        uploadStatus[uploadId].overallProgress = calculateOverallProgress(
          uploadStatus[uploadId]
        );

        // Emit error status
        io.emit("upload_status", uploadStatus[uploadId]);
        reject(error);
      }
    });
  });

  return Promise.all(uploadPromises);
};

// Improved overall progress calculation
function calculateOverallProgress(uploadStatus) {
  if (uploadStatus.totalFiles === 0) return 0;

  let totalBytes = 0;
  let uploadedBytes = 0;

  uploadStatus.files.forEach((file) => {
    totalBytes += file.size;
    uploadedBytes += (file.size * (file.progress || 0)) / 100;
  });

  return Math.round((uploadedBytes * 100) / totalBytes);
}
