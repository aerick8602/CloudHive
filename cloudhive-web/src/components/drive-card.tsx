import { FaFolder } from "react-icons/fa6";
import { FileDropdown } from "./file-dropdown";
import { Icon } from "lucide-react";
import Image from "next/image";
import { getIconForMimeType } from "@/utils/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Thumbnail } from "./thumbnail";

const dummyFile = {
  id: "1GEdkhlbg8FnW-MsBv6McRuGalT3DRFl3",
  fileName: "AYUSH KATIYAR RESUME.pdf",
  mimeType: "video/x-flv",
};

export function DriveCard() {
  const { icon: Icon, color } = getIconForMimeType(dummyFile.mimeType);
  const isLoading = false; // Toggle this based on your fetch logic

  const folderSkeletonCount = 4;
  const fileSkeletonCount = 7;

  return (
    <>
      <div className="font-semibold">Folder</div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
        {isLoading
          ? [...Array(folderSkeletonCount)].map((_, i) => (
              <Skeleton
                key={i}
                className="aspect-[35/12] sm:aspect-[22/6] md:aspect-[18/5] rounded-md sm:rounded-lg lg:rounded-xl p-4"
              />
            ))
          : [...Array(7)].map((_, i) => (
              <div
                key={i}
                className="aspect-[35/12] sm:aspect-[22/6] md:aspect-[18/5] bg-muted/50 hover:bg-muted/100 rounded-md sm:rounded-lg lg:rounded-xl transition-all duration-300 cursor-pointer p-4 flex flex-col gap-4"
              >
                <div className="h-full flex items-center justify-between text-center">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FaFolder size={20} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground truncate block flex-1 text-start ">
                      Assssssssssssssss
                    </span>
                  </div>
                  <FileDropdown />
                </div>
              </div>
            ))}
      </div>

      <div className="font-semibold">Files</div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
        {isLoading
          ? [...Array(fileSkeletonCount)].map((_, i) => (
              <Skeleton
                key={i}
                className="aspect-square rounded-md sm:rounded-lg lg:rounded-xl p-2"
              />
            ))
          : [...Array(27)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-md sm:rounded-lg lg:rounded-xl bg-muted/50 hover:bg-muted/100 transition-all duration-300 cursor-pointer p-2 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2 pl-1 md:p-1">
                  <div className="flex items-center gap-2 h-full text-center flex-1 min-w-0">
                    <Icon
                      style={{ color }}
                      className="text-md sm:text-base md:text-lg"
                    />
                    <span className="text-sm text-start font-medium text-muted-foreground truncate block flex-1">
                      Ayush File.jpeg
                    </span>
                    <FileDropdown />
                  </div>
                </div>

                <Thumbnail
                  src="https://drive.google.com/thumbnail?id=1kiXBRDgDPEeHynWuE1SDUdArfXPxxwl8"
                  fallback={
                    <Icon
                      style={{ color }}
                      className="size-15 md:size-18 xl:size-21"
                    />
                  }
                  className="flex-1 rounded-md bg-muted"
                />
              </div>
            ))}
      </div>
    </>
  );
}
