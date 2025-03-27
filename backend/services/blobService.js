const { put, list } = require("@vercel/blob");

exports.uploadBlob = async (filename, buffer, progressCallback) => {
  // If no progress callback needed, do regular upload
  if (!progressCallback) {
    return await put(filename, buffer, { access: "public" });
  }

  // Start the actual upload with progress tracking
  try {
    const result = await put(filename, buffer, {
      access: "public",
      onUploadProgress: (event) => {
        // The event provides loaded (bytes uploaded) and total (total bytes)
        const { loaded, total } = event;

        // Call the provided progress callback with the current progress
        progressCallback({
          loaded,
          total,
          percentage: Math.round((loaded / total) * 100), // Calculate percentage
        });
      },
    });

    return result;
  } catch (error) {
    throw error;
  }
};

// Existing getGalleryItems remains unchanged
exports.getGalleryItems = async () => {
  const { blobs } = await list();

  const videos = blobs.filter((blob) =>
    blob.pathname.match(/\.(mp4|webm|ogg)$/i)
  );

  return videos.map((video) => {
    const thumbnail = blobs.find(
      (blob) =>
        blob.pathname.startsWith("thumb-") &&
        blob.pathname.includes(
          video.pathname.replace(/^video-/, "").replace(/\.[^/.]+$/, "")
        )
    );

    return {
      id: video.pathname,
      url: video.url,
      thumbnailUrl: thumbnail?.url || "",
      filename: video.pathname,
      size: video.size,
      uploadedAt: video.uploadedAt,
    };
  });
};
