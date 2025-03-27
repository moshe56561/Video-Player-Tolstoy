import axios, { AxiosProgressEvent } from "axios";
import { VideoMetadata } from "../store/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const videoFetchers = {
  async uploadVideos(
    files: File[],
    onProgress?: (progressEvent: AxiosProgressEvent) => void
  ): Promise<{ uploadId: string; videos: VideoMetadata[] }> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(`videos`, file);
    });

    try {
      const response = await axios.post<{
        uploadId: string;
        videos: VideoMetadata[];
      }>(`${API_BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: onProgress,
      });
      return response.data;
    } catch (error) {
      console.error("Video upload failed:", error);
      throw error;
    }
  },

  async fetchVideos(): Promise<VideoMetadata[]> {
    try {
      const response = await axios.get<VideoMetadata[]>(
        `${API_BASE_URL}/gallery`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch videos:", error);
      throw error;
    }
  },
};
