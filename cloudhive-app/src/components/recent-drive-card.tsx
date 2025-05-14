import { FileCard } from "./card/file-card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileData } from "@/interface";
import { isToday, isYesterday, differenceInDays } from "date-fns";
import Image from "next/image";

interface RecentDriveCardProps {
  tab: string;
  allFile: FileData[];
  allLoading: boolean;
  onFolderClick?: (folderId: string, email: string, folderName: string) => void;
  hasFolders?: boolean;
  bgImage: string;
  bgfirstMessage?: string;
  bgsecondMessage?: string;
}

const groupFilesByDate = (files: FileData[]) => {
  const today: FileData[] = [];
  const yesterday: FileData[] = [];
  const last7Days: FileData[] = [];
  const last30Days: FileData[] = [];
  const older: FileData[] = [];

  const now = new Date();

  files.forEach((file) => {
    const date = new Date(file.modifiedTime || file.createdTime);
    const diff = differenceInDays(now, date);

    if (isToday(date)) {
      today.push(file);
    } else if (isYesterday(date)) {
      yesterday.push(file);
    } else if (diff <= 7) {
      last7Days.push(file);
    } else if (diff <= 30) {
      last30Days.push(file);
    } else {
      older.push(file);
    }
  });

  return { today, yesterday, last7Days, last30Days, older };
};

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

export function RecentDriveCard({
  tab,
  allFile,
  allLoading,
  bgImage,
  bgfirstMessage,
  bgsecondMessage,
}: RecentDriveCardProps) {
  const filteredFiles = allFile.filter(
    (file) => file.mimeType !== "application/vnd.google-apps.folder"
  );

  const { today, yesterday, last7Days, last30Days, older } =
    groupFilesByDate(filteredFiles);

  const renderSection = (title: string, files: FileData[]) => {
    if (files.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="font-semibold text-muted-foreground p-1 text-sm mb-2">
          {title}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          {files.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {allLoading ? (
        <div className="px-4">
          <div className="mb-6">
            <div className="font-semibold text-muted-foreground p-1 text-sm mb-2">
              Files
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
              {renderFileSkeleton(12)}
            </div>
          </div>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-muted-foreground text-sm text-center px-4">
          <Image
            src={bgImage}
            alt="Empty state illustration"
            width={300}
            height={200}
            className="mb-4"
            priority
          />
          <p className="font-medium text-2xl mb-4">{bgfirstMessage}</p>
          <p className="text-sm">{bgsecondMessage}</p>
        </div>
      ) : (
        <div className="px-4">
          {renderSection("Today", today)}
          {renderSection("Yesterday", yesterday)}
          {renderSection("Last 7 Days", last7Days)}
          {renderSection("Last 30 Days", last30Days)}
          {renderSection("Older", older)}
        </div>
      )}
    </>
  );
}
