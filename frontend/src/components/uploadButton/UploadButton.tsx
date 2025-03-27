import React from "react";
import Button from "@mui/material/Button";
import { UploadButtonStyles } from "./UploadButton.styles";

export const UploadButton: React.FC<UploadButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  return (
    <Button onClick={onClick} sx={UploadButtonStyles} disabled={disabled}>
      Upload Videos
    </Button>
  );
};
