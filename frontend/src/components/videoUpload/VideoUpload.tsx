// components/VideoUpload.tsx
import React, { useEffect, useState } from "react";
import { DropzoneDialog } from "mui-file-dropzone";
import { VideoUploadContainer } from "./VideoUpload.styles";
import { VideoUploadProps } from "./VideoUpload.types";
import { UploadButton } from "../uploadButton/UploadButton";
import { useVideoUpload } from "../../hooks/useVideoUpload";
import {
  LinearProgress,
  Alert,
  Snackbar,
  Typography,
  Box,
} from "@mui/material";

export const VideoUpload: React.FC<VideoUploadProps> = ({
  acceptedFileTypes = ["video/mp4", "video/webm", "video/ogg"],
  maxFileSize = 50000000, // 50MB default
}) => {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const {
    handleUpload,
    uploadProgress,
    isUploading,
    uploadError,
    resetUpload,
  } = useVideoUpload();

  const handleClose = () => {
    setOpen(false);
    setFiles([]);
  };

  useEffect(() => {}, [uploadProgress]);

  const handleSave = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    handleUpload(acceptedFiles);
    setOpen(false);
  };

  return (
    <VideoUploadContainer>
      {isUploading && (
        <Box sx={{ width: "50%", mt: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Uploading: {uploadProgress}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      )}

      <UploadButton onClick={() => setOpen(true)} disabled={isUploading} />

      <DropzoneDialog
        open={open}
        onSave={handleSave}
        onClose={handleClose}
        fileObjects={files}
        acceptedFiles={acceptedFileTypes}
        maxFileSize={maxFileSize}
        showPreviews={true}
        showFileNamesInPreview={true}
        filesLimit={10}
        dialogTitle="Upload Videos"
        submitButtonText="Upload"
        cancelButtonText="Cancel"
        dropzoneText="Drag and drop video files here or click"
      />

      <Snackbar
        open={!!uploadError}
        autoHideDuration={6000}
        onClose={() => resetUpload()}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => resetUpload()}
          severity="error"
          sx={{ width: "100%" }}
        >
          {uploadError}
        </Alert>
      </Snackbar>
    </VideoUploadContainer>
  );
};
