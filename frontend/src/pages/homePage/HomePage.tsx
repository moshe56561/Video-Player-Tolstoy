import React, { useEffect } from "react";
import { Carousel } from "../../components/carousel/Carousel";
import { useVideoStore } from "../../store/videoStore";
import { demoSlides } from "../../utils/DemoSlides";
import { VideoUpload } from "../../components/videoUpload/VideoUpload";
import {
  HomePageContainer,
  HomeTitle,
  NoVideosMessage,
} from "./HomePage.styles";

export const HomePage = () => {
  const { videos, fetchVideos, isLoading } = useVideoStore();

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const carouselSlides =
    videos.length > 0
      ? videos.map((video) => ({
          thumbnailUrl: video.thumbnailUrl,
          videoUrl: video.url,
        }))
      : demoSlides;

  return (
    <HomePageContainer>
      <HomeTitle>Video Carousel</HomeTitle>

      {videos.length === 0 && !isLoading && (
        <NoVideosMessage>
          <p>No videos uploaded yet. This is a demo carousel.</p>
        </NoVideosMessage>
      )}

      <Carousel slides={carouselSlides} />

      <VideoUpload
        acceptedFileTypes={["video/mp4", "video/webm", "video/ogg"]}
        maxFileSize={55 * 1024 * 1024} // 50MB
      />
    </HomePageContainer>
  );
};

export default HomePage;
