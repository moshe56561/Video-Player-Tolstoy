const uploadController = require("../controllers/uploadController");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Client connected");

    // Allow client to request status of an ongoing upload
    socket.on("get_upload_status", (uploadId) => {
      const status = uploadController.uploadStatus[uploadId];
      if (status) {
        socket.emit("upload_status", status);
      } else {
        socket.emit("upload_status", {
          error: "Upload status not found",
          uploadId,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};
