// src/utils/socketManager.js
class SocketManager {
  static io;
  static uploadStatus = {};

  static init(ioInstance) {
    this.io = ioInstance;

    this.io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      // Join upload room
      socket.on("join_upload_room", (uploadId) => {
        socket.join(uploadId);
        console.log(`Socket ${socket.id} joined room ${uploadId}`);
      });

      // Leave upload room
      socket.on("leave_upload_room", (uploadId) => {
        socket.leave(uploadId);
        console.log(`Socket ${socket.id} left room ${uploadId}`);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  static getIO() {
    if (!this.io) {
      throw new Error("Socket.IO not initialized");
    }
    return this.io;
  }

  static emitUploadProgress(uploadId, progressData) {
    if (this.io) {
      // Emit to both global and room-specific channels
      this.io.emit("upload_progress", {
        uploadId,
        ...progressData,
      });
    }
  }
}

module.exports = SocketManager;
