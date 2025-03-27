import { SxProps } from "@mui/material";

export const UploadButtonStyles: SxProps = {
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  color: "transparent",
  fontWeight: "bold",
  fontSize: "1.2rem",
  textTransform: "none",
  padding: "12px 24px",
  borderRadius: "8px",
  border: "2px solid rgba(255, 255, 255, 0.5)",
  width: "fit-content",
  display: "block",
  margin: "0 auto",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundImage: "linear-gradient(to right, red, yellow)",
  transition: "all 0.3s ease-in-out",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    backgroundColor: "rgba(128, 128, 128, 0.3)",
    "&::before": {
      opacity: 1,
    },
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3))",
    opacity: 0,
    transition: "opacity 0.3s ease-in-out",
    zIndex: 0,
  },
  "& > *": {
    position: "relative",
    zIndex: 1,
  },
};
