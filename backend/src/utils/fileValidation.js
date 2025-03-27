exports.videoFileFilter = (req, file, cb) => {
  const allowedTypes = ["video/mp4", "video/webm", "video/ogg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only MP4, WebM, and OGG videos are allowed."
      )
    );
  }
};
