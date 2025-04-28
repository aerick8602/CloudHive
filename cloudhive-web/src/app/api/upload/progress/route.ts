import { NextResponse } from "next/server";

// Store upload progress in memory
let uploadProgress = {
  uploadedFiles: 0,
  currentFile: "",
  currentFileSize: "",
};

// Simple GET endpoint to return current progress
export async function GET() {
  return NextResponse.json(uploadProgress);
}

// Update progress when a file is uploaded
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
