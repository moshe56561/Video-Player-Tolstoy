import { styled } from "@mui/system";

export const HomePageContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "2rem",
  gap: "2rem",
});

export const HomeTitle = styled("h1")({
  background: "linear-gradient(to right, red, yellow)",
  WebkitBackgroundClip: "text", // For text clipping in Webkit browsers
  color: "transparent", // Makes the text color transparent so the gradient shows
  textAlign: "center",
  marginBottom: "1rem",
  fontSize: "3.5rem",
  fontWeight: "bold",
  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
});

export const NoVideosMessage = styled("div")({
  color: "#fff",
  textAlign: "center",
  padding: "1rem",
  backgroundColor: "rgba(255,255,255,0.1)",
  borderRadius: "8px",
  marginBottom: "1rem",
});

export const VideoUploaderContainer = styled("div")({
  marginTop: "2rem",
  width: "100%",
  display: "flex",
  justifyContent: "center",
});
