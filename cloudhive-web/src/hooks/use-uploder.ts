import { useRef, useState } from "react";

export function useUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploadType, setUploadType] = useState<"file" | "folder">("file");

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
    const formData = new FormData();
    formData.append("provider", "google");
    formData.append("email", "katiyara089@gmail.com");
    formData.append("is_folder", uploadType === "folder" ? "true" : "false");

    Array.from(files).forEach((file) => {
      formData.append("files", file);
      if (uploadType === "folder") {
        const path = (file as any).webkitRelativePath;
        if (path) {
          formData.append("paths", path);
        }
      }
    });

    try {
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Upload failed");
      alert("✅ Upload successful!");
    } catch (err: any) {
      alert(`❌ Upload failed: ${err.message}`);
    }
  };

  return {
    inputRef,
    triggerUpload,
    handleFiles,
  };
}
