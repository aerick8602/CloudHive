import {
  FaImage,
  FaVideo,
  FaMusic,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileCsv,
  FaFileCode,
  FaFileLines,
  FaFileZipper,
  FaFile,
} from "react-icons/fa6";
import { IconType } from "react-icons";

type IconWithColor = {
  icon: IconType;
  color: string;
};

const CATEGORY_MIME_MAP: Record<string, string[]> = {
  Images: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/bmp",
    "image/tiff",
    "image/x-icon",
    "image/vnd.microsoft.icon",
    "image/svg+xml",
    "image/heic",
    "image/heif",
  ],
  Videos: [
    "video/mp4",
    "video/x-matroska",
    "video/webm",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-flv",
    "video/3gpp",
    "video/3gpp2",
    "video/mpeg",
    "video/ogg",
  ],
  Audio: [
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",
    "audio/mp4",
    "audio/webm",
    "audio/x-ms-wma",
    "audio/x-aac",
    "audio/x-flac",
    "audio/x-m4a",
    "audio/3gpp",
    "audio/amr",
  ],
  Documents: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.oasis.opendocument.text",
    "application/vnd.oasis.opendocument.spreadsheet",
    "application/vnd.oasis.opendocument.presentation",
    "application/x-iwork-pages-sffpages",
    "application/x-iwork-numbers-sffnumbers",
    "application/x-iwork-keynote-sffkey",
    "application/rtf",
  ],
  Text: [
    "text/plain",
    "text/html",
    "text/csv",
    "text/markdown",
    "application/json",
    "application/xml",
    "application/x-yaml",
    "application/javascript",
    "application/x-sh",
  ],
  Archives: [
    "application/zip",
    "application/x-tar",
    "application/x-7z-compressed",
    "application/x-rar-compressed",
    "application/gzip",
    "application/x-bzip2",
    "application/x-gtar",
    "application/x-apple-diskimage",
    "application/x-iso9660-image",
  ],
};

export function getIconForMimeType(mimeType: string): IconWithColor {
  if (CATEGORY_MIME_MAP.Images.includes(mimeType)) {
    return { icon: FaImage, color: "#e879f9" }; // pink-400
  }
  if (CATEGORY_MIME_MAP.Videos.includes(mimeType)) {
    return { icon: FaVideo, color: "#60a5fa" }; // blue-400
  }
  if (CATEGORY_MIME_MAP.Audio.includes(mimeType)) {
    return { icon: FaMusic, color: "#34d399" }; // green-400
  }

  // Specific document types
  switch (mimeType) {
    case "application/pdf":
      return { icon: FaFilePdf, color: "#ef4444" }; // red-500
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    case "application/vnd.oasis.opendocument.text":
    case "application/x-iwork-pages-sffpages":
    case "application/rtf":
      return { icon: FaFileWord, color: "#3b82f6" }; // blue-500
    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    case "application/vnd.oasis.opendocument.spreadsheet":
    case "application/x-iwork-numbers-sffnumbers":
      return { icon: FaFileExcel, color: "#22c55e" }; // green-500
    case "application/vnd.ms-powerpoint":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    case "application/vnd.oasis.opendocument.presentation":
    case "application/x-iwork-keynote-sffkey":
      return { icon: FaFilePowerpoint, color: "#f97316" }; // orange-500
    case "text/csv":
      return { icon: FaFileCsv, color: "#10b981" }; // emerald-500
  }

  // Text & Code formats
  if (mimeType === "application/json") {
    return { icon: FaFileCode, color: "#0ea5e9" }; // sky-500
  }
  if (mimeType === "text/plain") {
    return { icon: FaFileLines, color: "#6b7280" }; // gray-500
  }
  if (
    [
      "text/html",
      "text/markdown",
      "application/xml",
      "application/x-yaml",
      "application/javascript",
    ].includes(mimeType)
  ) {
    return { icon: FaFileCode, color: "#6366f1" }; // indigo-500
  }

  // Archives
  if (CATEGORY_MIME_MAP.Archives.includes(mimeType)) {
    return { icon: FaFileZipper, color: "#facc15" }; // yellow-400
  }

  // Generic fallbacks
  if (CATEGORY_MIME_MAP.Documents.includes(mimeType)) {
    return { icon: FaFileLines, color: "#9ca3af" }; // neutral-400
  }
  if (CATEGORY_MIME_MAP.Text.includes(mimeType)) {
    return { icon: FaFileLines, color: "#9ca3af" };
  }

  return { icon: FaFile, color: "#9ca3af" }; // default gray
}
