import { create } from "zustand";
import { videoFetchers } from "../api/fetchers";
import { VideoMetadata, VideoStoreState, VideoStoreActions } from "./types";
import { AxiosProgressEvent } from "axios";

export const useVideoStore = create<VideoStoreState & VideoStoreActions>(
  (set) => ({
    videos: [],
    isLoading: false,
    error: null,

    fetchVideos: async () => {
      set({ isLoading: true, error: null });
      try {
        const videos = await videoFetchers.fetchVideos();
        set({ videos, isLoading: false });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to fetch videos",
          isLoading: false,
        });
      }
    },

    uploadVideos: async (
      files: File[],
      onProgress?: (progressEvent: AxiosProgressEvent) => void
    ) => {
      set({ isLoading: true, error: null });
      try {
        const { uploadId, videos: newVideos } =
          await videoFetchers.uploadVideos(files, onProgress);
        set((state) => ({
          videos: [...state.videos, ...newVideos],
          isLoading: false,
        }));
        return { uploadId, videos: newVideos };
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Video upload failed",
          isLoading: false,
        });
        throw error;
      }
    },
    resetError: () => set({ error: null }),
  })
);
