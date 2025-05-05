import { Skeleton } from "@/components/ui/skeleton";
import { FolderCard } from "./card/folder-card";
import { FileCard } from "./card/file-card";
import { FileData } from "@/interface";

interface DriveCardProps {
  tab: string;
  allFile: FileData[];
  allLoading: boolean;
}

export function DriveCard({ tab, allFile, allLoading }: DriveCardProps) {
  // Filtering folders and files
  const folders = allFile.filter(
    (file) => file.mimeType === "application/vnd.google-apps.folder"
  );
  const files = allFile.filter(
    (file) => file.mimeType !== "application/vnd.google-apps.folder"
  );

  // Skeleton rendering
  const renderSkeleton = (count: number, isFolder: boolean) =>
    [...Array(count)].map((_, i) => (
      <Skeleton
        key={i}
        className={`${
          isFolder
            ? "aspect-[35/12] sm:aspect-[22/6] md:aspect-[18/5]"
            : "aspect-square"
        } rounded-md sm:rounded-lg lg:rounded-xl p-4 flex flex-col gap-4 bg-muted/50 animate-pulse`}
      >
        <div className="h-full flex items-center justify-between text-center">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Skeleton className="w-5 h-5 bg-muted/80 rounded-sm" />
            <div className="flex-1">
              <Skeleton className="w-full h-5 bg-muted/80" />
            </div>
          </div>
        </div>
      </Skeleton>
    ));

  // Skeletons while loading
  if (allLoading) {
    return (
      <>
        <div className="mb-8">
          <div className="font-semibold text-lg mb-2">Folder</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {renderSkeleton(6, true)} {/* Skeletons for folders */}
          </div>
        </div>

        <div>
          <div className="font-semibold text-lg mb-2">Files</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {renderSkeleton(12, false)} {/* Skeletons for files */}
          </div>
        </div>
      </>
    );
  }

  // Rendering content after loading
  return (
    <>
      {/* Folders Section */}
      <div className="mb-4">
        <div className="font-semibold text-muted-foreground p-1 text-sm mb-2">
          Folders
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          {folders.map((folder) => (
            <FolderCard key={folder.id} file={folder} />
          ))}
        </div>
      </div>

      {/* Files Section */}
      <div>
        <div className="font-semibold text-muted-foreground p-1  text-sm mb-2">
          Files
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          {files.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      </div>
    </>
  );
}
