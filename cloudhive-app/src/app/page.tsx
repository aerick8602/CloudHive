"use client";

import { useState, useRef } from "react";

export default function CloudUpload() {
  const [uploadType, setUploadType] = useState<"file" | "folder">("file");
  const [email, setEmail] = useState("");
  const [provider, setProvider] = useState("google");
  const [parentId, setParentId] = useState(""); // New state for parent folder ID
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async () => {
    const input = inputRef.current;
    if (!input || !input.files || input.files.length === 0) {
      alert("Please select files to upload");
      return;
    }

    setIsUploading(true);
    setUploadProgress("Preparing files...");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("provider", provider);
      formData.append("is_folder", uploadType === "folder" ? "true" : "false");

      // Append parent_id if it's provided
      if (parentId) {
        formData.append("parent_id", parentId);
      }

      const files = Array.from(input.files);
      files.forEach((file) => {
        formData.append("files", file);
        if (uploadType === "folder") {
          // Get the relative path from webkitRelativePath
          const path = (file as any).webkitRelativePath;
          if (path) {
            formData.append("paths", path);
          }
        }
      });

      setUploadProgress("Uploading files...");
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Upload failed");

      setUploadProgress("Upload complete!");
      alert("✅ Upload successful!");
      console.log("Uploaded:", data.uploaded);

      // Reset form
      input.value = "";
      setUploadProgress("");
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(`❌ Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadTypeChange = (type: "file" | "folder") => {
    setUploadType(type);
    // Reset the file input when changing upload type
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-xl mx-auto bg-white p-6 border rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">📤 Cloud Upload</h2>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            type="email"
            className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload Type:
          </label>
          <select
            className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={uploadType}
            onChange={(e) =>
              handleUploadTypeChange(e.target.value as "file" | "folder")
            }
          >
            <option value="file">File Upload</option>
            <option value="folder">Folder Upload</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {uploadType === "folder" ? "Select Folder" : "Select Files"}:
          </label>
          <input
            type="file"
            multiple
            required
            ref={(ref) => {
              if (ref) {
                const inputWithDirs = ref as unknown as HTMLInputElement & {
                  webkitdirectory?: boolean;
                  directory?: boolean;
                };

                if (uploadType === "folder") {
                  inputWithDirs.webkitdirectory = true;
                  inputWithDirs.directory = true;
                } else {
                  inputWithDirs.webkitdirectory = false;
                  inputWithDirs.directory = false;
                }

                inputRef.current = inputWithDirs;
              }
            }}
            className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* New input field for parent folder ID */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Parent Folder ID (Optional):
          </label>
          <input
            type="text"
            className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            placeholder="Enter Parent Folder ID (Optional)"
          />
        </div>

        {uploadProgress && (
          <div className="text-sm text-gray-600">{uploadProgress}</div>
        )}

        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors
            ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}
