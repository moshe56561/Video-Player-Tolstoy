import { create } from "zustand";
import io, { Socket } from "socket.io-client";

interface UploadProgress {
  uploadId: string;
  totalFiles: number;
  completedFiles: number;
  overallProgress: number;
  files: Array<{
    filename: string;
    progress: number;
    size: number;
    url?: string;
    thumbnailUrl?: string;
    error?: string;
  }>;
}

interface SocketStore {
  socket: Socket | null;
  isConnected: boolean;
  uploadProgress: UploadProgress | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
  subscribeToUpload: (uploadId: string) => void;
  unsubscribeFromUpload: (uploadId: string) => void;
}
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
export const useSocketStore = create<SocketStore>((set, get) => {
  let socket: Socket | null = null;

  const initializeSocket = () => {
    // Disconnect existing socket if any
    if (socket) {
      socket.disconnect();
      socket.removeAllListeners();
    }

    socket = io(API_BASE_URL, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      timeout: 30000,
      transports: ["websocket", "polling"],
      forceNew: true,
      autoConnect: false,
    });

    // Connection established
    socket.on("connect", () => {
      set({ socket, isConnected: true });
    });

    // Connection lost
    socket.on("disconnect", (reason) => {
      set({ isConnected: false });

      if (reason !== "io client disconnect") {
        setTimeout(() => get().connectSocket(), 1000);
      }
    });

    // Connection error
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      set({ isConnected: false });
      setTimeout(() => get().connectSocket(), 2000);
    });

    return socket;
  };

  const connectSocket = () => {
    if (socket?.connected || socket?.active) return;

    if (!socket) {
      socket = initializeSocket();
    }

    try {
      socket.connect();
    } catch (error) {
      console.error("Failed to connect socket:", error);
      setTimeout(() => {
        socket = initializeSocket();
        socket.connect();
      }, 2000);
    }

    set({ socket });
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      socket.removeAllListeners();
      socket = null;
      set({ socket: null, isConnected: false, uploadProgress: null });
    }
  };

  const subscribeToUpload = (uploadId: string) => {
    if (!socket?.connected) {
      console.warn("Cannot subscribe - socket not connected");
      connectSocket();

      setTimeout(() => {
        if (socket?.connected) {
          socket.emit("join_upload_room", uploadId);
        }
      }, 1000);
      return;
    }
    socket.emit("join_upload_room", uploadId);
  };

  const unsubscribeFromUpload = (uploadId: string) => {
    if (!socket?.connected) {
      console.warn("Cannot unsubscribe - socket not connected");
      return;
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => {
      if (socket) {
        disconnectSocket();
      }
    });
  }

  return {
    socket: null,
    isConnected: false,
    uploadProgress: null,
    connectSocket,
    disconnectSocket,
    subscribeToUpload,
    unsubscribeFromUpload,
  };
});
