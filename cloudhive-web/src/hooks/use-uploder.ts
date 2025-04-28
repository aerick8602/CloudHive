import { useRef, useState } from "react";
import { toast } from "sonner";

export function useUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [uploadType, setUploadType] = useState<"file" | "folder">("file");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<string>("");
  const [totalFiles, setTotalFiles] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState(0);
  const [currentFileSize, setCurrentFileSize] = useState<string>("");

  const triggerUpload = (type: "file" | "folder") => {
    setUploadType(type);
    const input = inputRef.current;
    if (input) {
      if (type === "folder") {
        (input as any).webkitdirectory = true;
        (input as any).directory = true;
      } else {
        (input as any).webkitdirectory = false;
        (input as any).directory = false;
      }
      input.click();
    }
  };

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) {
      toast.error("No files selected", {
        description: "Please select at least one file to upload",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setTotalFiles(files.length);
    setUploadedFiles(0);
    const formData = new FormData();
    formData.append("email", "pawankatiyar63@gmail.com");
    formData.append("rootFolderId", "root");
    formData.append("folderName", "Uploaded Files");

    try {
      // Validate files
      const fileArray = Array.from(files);
      for (const file of fileArray) {
        if (file.size > 100 * 1024 * 1024) {
          // 100MB limit
          throw new Error(
            `File ${file.name} is too large. Maximum size is 100MB`
          );
        }
      }

      // Add files to form data
      fileArray.forEach((file) => {
        formData.append("files", file);
        if (uploadType === "folder") {
          const path = (file as any).webkitRelativePath;
          if (path) {
            formData.append("paths", path);
          }
        }
      });

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload", true);
      xhr.setRequestHeader("x-upload-type", uploadType);

      // Track total files and current file index
      setTotalFiles(fileArray.length);
      setUploadedFiles(0);
      setUploadProgress(0);

      // Poll for progress updates
      let pollInterval: NodeJS.Timeout | null = null;

      const startPolling = () => {
        pollInterval = setInterval(async () => {
          try {
            const response = await fetch("/api/upload/progress");
            if (response.ok) {
              const data = await response.json();
              setUploadedFiles(data.uploadedFiles);
              setCurrentFile(data.currentFile);
              setCurrentFileSize(data.currentFileSize);
              // Calculate progress based on actual uploaded files
              const progress = (data.uploadedFiles / fileArray.length) * 100;
              setUploadProgress(Math.min(progress, 99));
            }
          } catch (error) {
            console.error("Error polling progress:", error);
          }
        }, 1000);
      };

      const stopPolling = () => {
        if (pollInterval) {
          clearInterval(pollInterval);
          pollInterval = null;
        }
      };

      // Start polling
      startPolling();

      xhr.onload = () => {
        stopPolling();
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          // Set final progress
          setUploadedFiles(fileArray.length);
          setUploadProgress(100);
          toast.success("Upload successful", {
            description: `Successfully uploaded ${fileArray.length} ${
              fileArray.length === 1 ? "file" : "files"
            }`,
          });
          // Reset states after a short delay
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
            setCurrentFile("");
            setTotalFiles(0);
            setUploadedFiles(0);
            setCurrentFileSize("");
          }, 1000);
        } else {
          const error = JSON.parse(xhr.responseText);
          throw new Error(error.error || "Upload failed");
        }
      };

      xhr.onerror = () => {
        stopPolling();
        throw new Error("Network error occurred during upload");
      };

      xhr.send(formData);
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error("Upload failed", {
        description: err.message || "An error occurred during upload",
      });
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentFile("");
      setTotalFiles(0);
      setUploadedFiles(0);
      setCurrentFileSize("");
    }
  };

  return {
    inputRef,
    triggerUpload,
    handleFiles,
    isOpen,
    setIsOpen,
    uploadType,
    setUploadType,
    isUploading,
    setIsUploading,
    uploadProgress,
    setUploadProgress,
    currentFile,
    setCurrentFile,
    totalFiles,
    setTotalFiles,
    uploadedFiles,
    setUploadedFiles,
    currentFileSize,
    setCurrentFileSize,
  };
}
