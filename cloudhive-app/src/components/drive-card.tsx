import { Skeleton } from "@/components/ui/skeleton";
import { FolderCard } from "./card/folder-card";
import { FileCard } from "./card/file-card";
import { FileData } from "@/interface";

interface DriveCardProps {
  tab: string;
  allFile: FileData[];
  allLoading: boolean;
  onFolderClick?: (folderId: string, email: string, folderName: string) => void;
  hasFolders?: boolean; // <== NEW
  bgImage?: string;
  bgfirstMessage?: string;
  bgsecondMessage?: string;
}

export function DriveCard({
  tab,
  allFile,
  allLoading,
  onFolderClick,
  bgImage,
  bgfirstMessage,
  bgsecondMessage,
  hasFolders = true, // default true for backward compatibility
}: DriveCardProps) {
  const folders = allFile.filter(
    (file) => file.mimeType === "application/vnd.google-apps.folder"
  );
  const files = allFile.filter(
    (file) => file.mimeType !== "application/vnd.google-apps.folder"
  );

  const renderFolderSkeleton = (count: number) =>
    [...Array(count)].map((_, i) => (
      <Skeleton
        key={i}
        className="aspect-[35/12] sm:aspect-[22/6] md:aspect-[18/5] bg-muted/50 rounded-md sm:rounded-lg lg:rounded-xl p-4 flex flex-col gap-4 animate-pulse"
      >
        <div className="h-full flex items-center justify-between text-center">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Skeleton className="w-5 h-5 bg-muted/80 rounded-sm" />
            <Skeleton className="flex-1 h-5 bg-muted/80 rounded-sm" />
          </div>
          <Skeleton className="w-5 h-5 bg-muted/70 rounded" />
        </div>
      </Skeleton>
    ));

  const renderFileSkeleton = (count: number) =>
    [...Array(count)].map((_, i) => (
      <Skeleton
        key={i}
        className="aspect-square rounded-lg bg-muted/60 p-1 lg:p-2 flex flex-col justify-between animate-pulse"
      >
        <div className="flex items-center justify-between -mt-0.5">
          <div className="flex items-center gap-2 h-full text-center flex-1 min-w-0 p-1 pl-2 pb-2">
            <Skeleton className="w-5 h-5 bg-muted/80 rounded-sm -ml-2" />
            <Skeleton className="flex-1 h-5 bg-muted/80 rounded-sm" />
          </div>
        </div>
        <Skeleton className="flex-1 rounded-sm bg-muted/40" />
      </Skeleton>
    ));

  return (
    <>
      {allLoading ? (
        <div className="px-4">
          {hasFolders && (
            <div className="mb-4">
              <div className="font-semibold text-muted-foreground p-1 text-sm mb-2">
                Folders
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                {renderFolderSkeleton(7)}
              </div>
            </div>
          )}

          <div className="mb-8">
            <div className="font-semibold text-muted-foreground p-1 text-sm mb-2">
              Files
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
              {renderFileSkeleton(12)}
            </div>
          </div>
        </div>
      ) : allFile.length === 0 ? (
        <div className=" flex flex-col items-center justify-center   text-muted-foreground text-sm text-center px-4">
          <img
            src={bgImage}
            alt="Upload illustration "
            className="mb-4"
            width={300}
          />
          <p className=" font-medium text-2xl mb-4">{bgfirstMessage}</p>
          <p className="text-sm">{bgsecondMessage}</p>
        </div>
      ) : (
        <div className="px-4">
          {hasFolders && folders.length > 0 && (
            <div className="mb-4 ">
              <div className="font-semibold text-muted-foreground p-1 text-sm mb-2">
                Folders
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                {folders.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    file={folder}
                    onClick={onFolderClick}
                  />
                ))}
              </div>
            </div>
          )}

          {files.length > 0 && (
            <div className="mb-8">
              <div className="font-semibold text-muted-foreground p-1 text-sm mb-2">
                Files
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                {files.map((file) => (
                  <FileCard key={file.id} file={file} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
