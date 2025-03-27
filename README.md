# Video Gallery

## Overview
This is a full-stack web application that allows users to upload videos, generate thumbnails, and display them in a carousel gallery. The backend processes videos and stores them using Vercel Blob storage, while the frontend provides a user-friendly interface for uploads and viewing.

## Features
### Frontend
- **Video Upload Interface:**
  - Users can select and upload multiple videos simultaneously.
  - Upload and processing progress bars for better user experience.
- **Video Gallery Carousel:**
  - Thumbnails are displayed in a responsive carousel layout.
  - Clicking on a thumbnail plays the corresponding video within the carousel.

### Backend
- **Video Processing:**
  - Extracts a frame from uploaded videos to generate thumbnails.
  - Stores videos and thumbnails in Vercel Blob storage.
- **API Endpoints:**
  - `POST /upload` - Handles video uploads, processes thumbnails, and returns stored file URLs.
  - `GET /gallery` - Provides metadata for all uploaded videos, including thumbnail URLs.

## Installation
1. **Clone the Repository:**
   ```sh
   git clone <repository_url>
   cd <repository_name>
   ```
2. **Install Dependencies:**
   - Backend:
     ```sh
     cd server
     npm install
     ```
   - Frontend:
     ```sh
     cd client
     npm install
     ```

## Running the Application
1. **Start the Backend:**
   ```sh
   cd server
   npm start
   ```
2. **Start the Frontend:**
   ```sh
   cd client
   npm run dev
   ```

## Deployment
A live demo of this application is available at: **https://video-player-tolstoy-ale3-git-main-dira3d.vercel.app/**



