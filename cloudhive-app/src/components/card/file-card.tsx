import { useState } from "react";
import { getIconForMimeType } from "@/utils/icons";
import { Thumbnail } from "../thumbnail";
import { FileDropdown } from "../file-dropdown";
import { FileData } from "@/interface";
import PreviewBox from "../dialog/preview";

interface FileCardProps {
  tab?: string;
  file: FileData;
  initialView?: boolean; // optional initial value for view state
}

export function FileCard({ tab, file, initialView = true }: FileCardProps) {
  // Destructure fields from file prop
  const {
    id,
    email,
    name,
    mimeType,
    parents,
    starred,
    trashed,
    createdTime,
    modifiedTime,
    viewedByMe,
    viewedByMeTime,
    permissions,
    quotaBytesUsed,
    owners,
  } = file;

  // States for fields that might change locally
  const [view, setView] = useState<boolean>(initialView);
  const [localstarred, setStarred] = useState<boolean>(file.starred);
  const [localtrashed, setTrashed] = useState<boolean>(file.trashed);
  const [localname, setName] = useState<string>(file.name);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const { icon: Icon, color } = getIconForMimeType(mimeType);

  // If view is false (e.g. file was restored or trashed), don't render card
  if (!view) return null;

  // Compose Google Drive preview URL for this file
  const previewUrl = `https://drive.google.com/file/d/${id}/preview`;

  return (
    <>
      <div
        className="aspect-square rounded-lg bg-muted/60 hover:bg-muted/100 transition-all duration-300 p-1 lg:p-2 flex flex-col justify-between cursor-pointer"
        onDoubleClick={() => setShowPreview(true)}
      >
        <div className="flex items-center justify-between -mt-0.5">
          <div className="flex items-center gap-2 h-full text-center flex-1 min-w-0 p-1 pl-2 pb-2">
            <Icon
              style={{ color }}
              className="text-md sm:text-base md:text-lg"
            />
            <span className="text-sm text-start font-medium text-muted-foreground truncate block flex-1">
              {localname}
            </span>
            <FileDropdown
              setShowPreview={() => setShowPreview(!showPreview)}
              tab={tab}
              localstarred={localstarred}
              setStarred={setStarred}
              setName={setName}
              setView={setView}
              localtrashed={localtrashed}
              file={file}
            />
          </div>
        </div>

        <Thumbnail
          thumnailLink={file.thumbnailLink}
          src={`https://drive.google.com/thumbnail?id=${id}`}
          fallback={
            <Icon
              style={{ color }}
              className="w-2/3 h-2/3 sm:w-3/4 sm:h-3/4 md:w-4/5 md:h-4/5 max-w-[50%] max-h-[50%]"
            />
          }
          className="flex-1 rounded-sm bg-muted"
        />
      </div>

      {showPreview && (
        <PreviewBox
          downloadUrl={`https://drive.google.com/uc?id=${file.id}&export=download`}
          previewUrl={previewUrl}
          localname={localname}
          showPreview={showPreview}
          setShowPreview={() => setShowPreview(false)}
        />
      )}
    </>
  );
}
