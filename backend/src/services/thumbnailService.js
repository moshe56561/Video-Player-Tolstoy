const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const sharp = require("sharp");
const { Readable } = require("stream");

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

exports.generateThumbnail = (videoBuffer) => {
  return new Promise((resolve, reject) => {
    const thumbnailChunks = [];
    const videoStream = Readable.from(videoBuffer);

    ffmpeg(videoStream)
      .on("error", reject)
      .outputOptions([
        "-ss 00:00:01.000", // Seek to 1 second
        "-vframes 1", // Capture 1 frame
        "-f image2pipe", // Output to stream
        "-vcodec mjpeg", // JPEG format
      ])
      .pipe() // Get output stream
      .on("data", (chunk) => thumbnailChunks.push(chunk))
      .on("end", () => resolve(Buffer.concat(thumbnailChunks)))
      .on("error", reject);
  });
};

exports.optimizeThumbnail = (thumbnailBuffer) => {
  return sharp(thumbnailBuffer)
    .resize(640, 360)
    .jpeg({ quality: 80 })
    .toBuffer();
};
