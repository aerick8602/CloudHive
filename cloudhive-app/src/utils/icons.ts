// Add these if not already imported
import {
  FaGoogleDrive,
  FaFolder,
  FaFileAudio,
  FaFileVideo,
  FaFilePowerpoint,
  FaFileExcel,
  FaFileWord,
  FaFilePdf,
  FaCode,
  FaLink,
  FaPenFancy,
  FaEnvelope,
  FaFileLines,
  FaFile,
  FaFileZipper,
  FaFileCsv,
  FaImage,
  FaVideo,
  FaMusic,
  FaFileCode,
} from "react-icons/fa6";
import { PiGooglePhotosLogoFill } from "react-icons/pi";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";
import { IconType } from "react-icons";
import { CATEGORY_MIME_MAP } from "./mimetypes";

type IconWithColor = {
  icon: IconType;
  color: string;
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

  // Google Drive-specific MIME types
  switch (mimeType) {
    case "application/vnd.google-apps.audio":
      return { icon: FaFileAudio, color: "#4ade80" };
    case "application/vnd.google-apps.document":
      return { icon: FaFileWord, color: "#3b82f6" };
    case "application/vnd.google-apps.drive-sdk":
    case "application/vnd.google-apps.shortcut":
      return { icon: FaLink, color: "#a855f7" };
    case "application/vnd.google-apps.drawing":
      return { icon: FaPenFancy, color: "#f59e0b" };
    case "application/vnd.google-apps.file":
      return { icon: FaGoogleDrive, color: "#22d3ee" };
    case "application/vnd.google-apps.folder":
      return { icon: FaFolder, color: "#fbbf24" };
    case "application/vnd.google-apps.form":
      return { icon: FaFileAlt, color: "#8b5cf6" };
    case "application/vnd.google-apps.fusiontable":
      return { icon: FaFileAlt, color: "#10b981" };
    case "application/vnd.google-apps.jam":
      return { icon: FaPenFancy, color: "#ec4899" };
    case "application/vnd.google-apps.mail-layout":
      return { icon: FaEnvelope, color: "#f43f5e" };
    case "application/vnd.google-apps.map":
      return { icon: FaMapMarkedAlt, color: "#10b981" };
    case "application/vnd.google-apps.photo":
      return { icon: PiGooglePhotosLogoFill, color: "#f472b6" };
    case "application/vnd.google-apps.presentation":
      return { icon: FaFilePowerpoint, color: "#f97316" };
    case "application/vnd.google-apps.script":
      return { icon: FaCode, color: "#6366f1" };
    case "application/vnd.google-apps.site":
      return { icon: FaFileAlt, color: "#3b82f6" };
    case "application/vnd.google-apps.spreadsheet":
      return { icon: FaFileExcel, color: "#22c55e" };
    case "application/vnd.google-apps.unknown":
      return { icon: FaFile, color: "#9ca3af" };
    case "application/vnd.google-apps.vid":
    case "application/vnd.google-apps.video":
      return { icon: FaFileVideo, color: "#60a5fa" };
  }

  // Specific common document types
  switch (mimeType) {
    case "application/pdf":
      return { icon: FaFilePdf, color: "#ef4444" };
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    case "application/vnd.oasis.opendocument.text":
    case "application/x-iwork-pages-sffpages":
    case "application/rtf":
      return { icon: FaFileWord, color: "#3b82f6" };
    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    case "application/vnd.oasis.opendocument.spreadsheet":
    case "application/x-iwork-numbers-sffnumbers":
      return { icon: FaFileExcel, color: "#22c55e" };
    case "application/vnd.ms-powerpoint":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    case "application/vnd.oasis.opendocument.presentation":
    case "application/x-iwork-keynote-sffkey":
      return { icon: FaFilePowerpoint, color: "#f97316" };
    case "text/csv":
      return { icon: FaFileCsv, color: "#10b981" };
  }

  if (mimeType === "application/json") {
    return { icon: FaFileCode, color: "#0ea5e9" };
  }
  if (mimeType === "text/plain") {
    return { icon: FaFileLines, color: "#6b7280" };
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
    return { icon: FaFileCode, color: "#6366f1" };
  }

  if (CATEGORY_MIME_MAP.Archives.includes(mimeType)) {
    return { icon: FaFileZipper, color: "#facc15" };
  }
  if (CATEGORY_MIME_MAP.Documents.includes(mimeType)) {
    return { icon: FaFileLines, color: "#9ca3af" };
  }
  if (CATEGORY_MIME_MAP.Text.includes(mimeType)) {
    return { icon: FaFileLines, color: "#9ca3af" };
  }

  return { icon: FaFile, color: "#9ca3af" }; // default
}
