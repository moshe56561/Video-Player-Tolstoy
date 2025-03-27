import styled from "styled-components";

export const CarouselWrapper = styled.div`
  position: relative;
  width: 80%;
  max-width: 800px;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #111;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  margin: 0 auto;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

export const CarouselContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensure the thumbnail covers the container without distortion */
  border-radius: 16px;
  cursor: pointer; /* Pointer cursor for interactivity */
  transition: transform 0.3s ease, opacity 0.3s ease;

  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }
`;

export const CarouselVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain; /* Keep video properly contained within the container */
  border-radius: 16px;
  cursor: pointer; /* Pointer cursor for interactivity */
`;

export const Button = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 1.5rem;
  padding: 10px;
  border-radius: 50%;
  opacity: 0.7;
  transition: opacity 0.3s ease, background-color 0.3s ease;
  cursor: pointer; /* Add pointer cursor on the arrows as well */

  &:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.8);
  }

  &:first-of-type {
    left: 16px;
  }

  &:last-of-type {
    right: 16px;
  }
`;
