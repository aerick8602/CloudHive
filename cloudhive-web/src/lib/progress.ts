// Update progress when a file is uploaded

// Store upload progress in memory
let uploadProgress = {
  uploadedFiles: 0,
  currentFile: "",
  currentFileSize: "",
};

export function updateProgress(fileName: string, fileSize: string) {
  uploadProgress.uploadedFiles++;
  uploadProgress.currentFile = fileName;
  uploadProgress.currentFileSize = fileSize;
}

// Reset progress at the start of a new upload
export function resetProgress() {
  uploadProgress = {
    uploadedFiles: 0,
    currentFile: "",
    currentFileSize: "",
  };
}
