import { FC, useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import {
  CarouselWrapper,
  CarouselContent,
  CarouselImage,
  CarouselVideo,
  Button,
} from "./Carousel.styles";

export const Carousel: FC<CarouselProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Reset the currentIndex to 0 whenever slides change
  useEffect(() => {
    setCurrentIndex(0);
  }, [slides]);

  const changeSlide = (direction: number) => {
    setCurrentIndex((prev) => {
      const newIndex = (prev + direction + slides.length) % slides.length;
      setIsPlaying(false);
      return newIndex;
    });
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => changeSlide(1),
    onSwipedRight: () => changeSlide(-1),
  });

  return (
    <CarouselWrapper {...handlers}>
      <CarouselContent>
        {isPlaying && slides[currentIndex].videoUrl ? (
          <CarouselVideo
            src={slides[currentIndex].videoUrl}
            controls
            autoPlay
          />
        ) : (
          <CarouselImage
            src={slides[currentIndex].thumbnailUrl}
            alt="Thumbnail"
            onClick={() => setIsPlaying(true)}
          />
        )}
      </CarouselContent>

      <Button onClick={() => changeSlide(-1)}>&#9664;</Button>
      <Button onClick={() => changeSlide(1)}>&#9654;</Button>
    </CarouselWrapper>
  );
};
