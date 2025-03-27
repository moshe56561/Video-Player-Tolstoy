// hooks/useVideoUpload.ts
import { useEffect, useState, useCallback } from "react";
import { useSocketStore } from "../store/socketStore"; // assuming you already have the socket store
import { useVideoStore } from "../store/videoStore";

interface UploadFileStatus {
  filename: string;
  progress: number;
  url?: string;
  thumbnailUrl?: string;
}

interface UploadStatus {
  uploadId: string;
  totalFiles: number;
  completedFiles: number;
  overallProgress: number;
  files: UploadFileStatus[];
}

export const useVideoUpload = () => {
  const { socket, subscribeToUpload, unsubscribeFromUpload } = useSocketStore();
  const { uploadVideos } = useVideoStore();

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      setIsUploading(true);
      setUploadError(null);
      setUploadProgress(0);

      try {
        // Assume uploadVideos is a function that uploads and returns an uploadId
        const result = await uploadVideos(files);
        setUploadId(result.uploadId);
        subscribeToUpload(result.uploadId); // Subscribe to the upload progress room
        setIsUploading(false);
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : "Upload failed"
        );
        setIsUploading(false);
      }
    },
    [subscribeToUpload]
  );

  const resetUpload = useCallback(() => {
    setUploadProgress(0);
    setIsUploading(false);
    setUploadError(null);
    setUploadId(null);
    unsubscribeFromUpload(uploadId || ""); // Unsubscribe when reset
  }, [uploadId, unsubscribeFromUpload]);

  // Listen to the socket upload_progress event and update state
  useEffect(() => {
    if (socket) {
      socket.on("upload_progress", (data: UploadStatus) => {
        setUploadProgress(data.overallProgress);
      });
    }

    // Cleanup on component unmount
    return () => {
      if (socket) {
        socket.removeListener("upload_progress");
      }
    };
  }, [socket, uploadId]);

  return {
    handleUpload,
    uploadProgress,
    isUploading,
    uploadError,
    uploadId,
    resetUpload,
    resetError: () => setUploadError(null),
  };
};
