import { AxiosProgressEvent } from "axios";

export interface VideoMetadata {
  id: string;
  originalFileName: string;
  thumbnailUrl: string;
  uploadedAt: string;
  fileSize: number;
  url: string;
  uploadId: string;
}

export interface VideoStoreState {
  videos: VideoMetadata[];
  isLoading: boolean;
  error: string | null;
}

export interface VideoStoreActions {
  fetchVideos: () => Promise<void>;

  resetError: () => void;
  uploadVideos: (
    files: File[],
    onProgress?: (progressEvent: AxiosProgressEvent) => void
  ) => Promise<{ uploadId: string; videos: VideoMetadata[] }>;
}
