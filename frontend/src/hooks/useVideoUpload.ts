import { useEffect, useState, useCallback } from "react";
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
        setIsUploading(false);
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : "Upload failed"
        );
        setIsUploading(false);
      }
    },
    [uploadVideos]
  );

  const resetUpload = useCallback(() => {
    setUploadProgress(0);
    setIsUploading(false);
    setUploadError(null);
    setUploadId(null);
  }, []);

  // Polling to fetch upload progress
  useEffect(() => {
    let interval: NodeJS.Timeout;

    console.log("🚀 ~ useEffect ~ isUploading:", isUploading);
    if (isUploading) {
      const incrementProgress = () => {
        setUploadProgress((prevProgress) => {
          // Gradually move towards 100%
          if (prevProgress < 100) {
            return Math.min(prevProgress + Math.random() * 2, 100); // Increment slowly
          }
          return 100; // Ensure it reaches 100
        });
      };

      interval = setInterval(incrementProgress, 100); // Poll every 100ms for smooth transition

      return () => clearInterval(interval); // Clean up when done
    }

    return () => {}; // Clean up on component unmount
  }, [uploadId, isUploading]);

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
