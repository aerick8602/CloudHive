import { FaFolder } from "react-icons/fa6";
import { FileDropdown } from "./file-dropdown";
import { Icon } from "lucide-react";
import Image from "next/image";
import { getIconForMimeType } from "@/app/utils/icons";
const dummyFile = {
  id: "1GEdkhlbg8FnW-MsBv6McRuGalT3DRFl3",
  fileName: "AYUSH KATIYAR RESUME.pdf",
  mimeType: "application/pdf",

  iconLink:
    "https://drive-thirdparty.googleusercontent.com/16/type/application/pdf",
  thumbnailLink:
    "https://lh3.googleusercontent.com/drive-storage/AJQWtBPJlPwnP9wUbF-VzcZNEebMpYt02cJ-qQgtKTbCT65CYXkVcee9Kumh5WdL_UgavyVGHpw6-k7vlNDrv9KruLmv0aZIkXhCugcxhnMnDHKSBuA=s220",
  webViewLink:
    "https://drive.google.com/file/d/1GEdkhlbg8FnW-MsBv6McRuGalT3DRFl3/view?usp=drivesdk",
  isStarred: false,
  isTrashed: false,
  modifiedTime: "2025-04-16T14:35:58.295Z",
  provider: "google",
};
const dummyFile1 = {
  id: "1GEdkhlbg8FnW-MsBv6McRuGalT3DRFl3",
  fileName: "naruto.jpeg",
  mimeType: "application/pdf",
  iconLink: "https://drive-thirdparty.googleusercontent.com/16/type/image/jpeg",
  thumbnailLink:
    "https://lh3.googleusercontent.com/drive-storage/AJQWtBOo7U7UuK-5yKKMwIQ-H1aW_Psa9PBHWv_XZ1MyVF8_2lnwtAeQn44AMxSsv4V8QK7de98PKYZMhCxoQKbthbFmsDCXXwm42nFurqFCZ8PcZQ=s220",
  webViewLink:
    "https://drive.google.com/file/d/1GEdkhlbg8FnW-MsBv6McRuGalT3DRFl3/view?usp=drivesdk",
  isStarred: false,
  isTrashed: false,
  modifiedTime: "2025-04-16T14:35:58.295Z",
  provider: "google",
};

export function DriveCard() {
  const { icon: Icon, color } = getIconForMimeType(dummyFile.mimeType);
  return (
    <>
      <div className="font-semibold">Folder</div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="aspect-[35/12] sm:aspect-[22/6] md:aspect-[18/5] bg-muted/50 hover:bg-muted/100 rounded-md sm:rounded-lg lg:rounded-xl transition-all duration-300 cursor-pointer p-4 flex flex-col gap-4"
          >
            <div className="h-full flex items-center justify-between text-center">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FaFolder size={20} className="text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground truncate block flex-1 pl-1">
                  Ayushdddddddddddddddddddddddd
                </span>
              </div>
              <FileDropdown />
            </div>
          </div>
        ))}
      </div>
      <div className="font-semibold">Files</div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-md sm:rounded-lg lg:rounded-xl bg-muted/50 hover:bg-muted/100 transition-all duration-300 cursor-pointer p-2 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2 p-1">
              <div className="flex items-center gap-2 h-full text-center flex-1 min-w-0">
                <Icon
                  style={{ color }}
                  className="text-md sm:text-base md:text-lg"
                />

                <span className="text-sm font-medium text-muted-foreground truncate block flex-1">
                  Ayusddddddddddddddddddh.jpeg
                </span>
                <FileDropdown />
              </div>
            </div>

            <div className="relative flex-1 rounded-md overflow-hidden bg-muted flex items-center justify-center">
              {dummyFile.thumbnailLink ? (
                <Image
                  src={dummyFile1.thumbnailLink}
                  alt="thumbnail"
                  width={230}
                  height={230}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-xs text-muted-foreground">
                  No Preview
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
