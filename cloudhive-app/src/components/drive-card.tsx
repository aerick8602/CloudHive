import { getIconForMimeType } from "@/utils/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderCard } from "./card/folder-card";
import { FileCard } from "./card/file-card";

const dummyFile = {
  id: "1NzXLEbi4Nxf8nwa-hGv7MMyXB68Wy6kC",
  fileName: "AYUSH KATIYAR RESUME.pdf",
  mimeType: "video/x-flv",
};

type DriveCardProps = {
  email: string;
  files: any[]; // Replace 'any' with a specific file type if available
  loading: boolean;
  error?: any;
};

export function DriveCard({ email, files, loading, error }: DriveCardProps) {
  const { icon: Icon, color } = getIconForMimeType(dummyFile.mimeType);
  const isLoading = false;

  const folderSkeletonCount = 4;
  const fileSkeletonCount = 7;

  return (
    <>
      <div className="font-semibold">Folder</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
        {isLoading
          ? [...Array(folderSkeletonCount)].map((_, i) => (
              <Skeleton
                key={i}
                className="aspect-[35/12] sm:aspect-[22/6] md:aspect-[18/5] rounded-md sm:rounded-lg lg:rounded-xl p-4"
              />
            ))
          : [...Array(7)].map((_, i) => (
              <FolderCard key={i} name="Assssssssssssssss" />
            ))}
      </div>

      <div className="font-semibold">Files</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
        {isLoading
          ? [...Array(fileSkeletonCount)].map((_, i) => (
              <Skeleton
                key={i}
                className="aspect-square rounded-md sm:rounded-lg lg:rounded-xl p-2"
              />
            ))
          : [...Array(27)].map((_, i) => (
              <FileCard
                key={i}
                name="Ayush File.jpeg"
                icon={Icon}
                color={color}
                thumbnailId="1NzXLEbi4Nxf8nwa-hGv7MMyXB68Wy6kC"
              />
            ))}
      </div>
    </>
  );
}
