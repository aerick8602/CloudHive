import { useState } from "react";
import { getIconForMimeType } from "@/utils/icons";
import { Thumbnail } from "../thumbnail";
import { FileDropdown } from "../file-dropdown";
import { FileData } from "@/interface";

interface FileCardProps {
  file: FileData;
  initialView?: boolean; // optional initial value for view state
}

export function FileCard({ file, initialView = true }: FileCardProps) {
  // Destructure fields from file prop
  const {
    id,
    email,
    name: initialName,
    mimeType,
    parents,
    starred: initialStarred,
    trashed: initialTrashed,
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
  const [starred, setStarred] = useState<boolean>(initialStarred);
  const [trashed, setTrashed] = useState<boolean>(initialTrashed);
  const [name, setName] = useState<string>(initialName);

  const { icon: Icon, color } = getIconForMimeType(mimeType);

  // If view is false (e.g. file was restored or trashed), don't render card
  if (!view) return null;

  return (
    <div className="aspect-square rounded-lg bg-muted/60 hover:bg-muted/100 transition-all duration-300 p-1 lg:p-2 flex flex-col justify-between">
      <div className="flex items-center justify-between -mt-0.5">
        <div className="flex items-center gap-2 h-full text-center flex-1 min-w-0 p-1 pl-2 pb-2">
          <Icon style={{ color }} className="text-md sm:text-base md:text-lg" />
          <span className="text-sm text-start font-medium text-muted-foreground truncate block flex-1">
            {name}
          </span>
          <FileDropdown
            starred={starred}
            setStarred={setStarred}
            setName={setName}
            setView={setView}
            trashed={trashed}
            file={file}
          />
        </div>
      </div>

      <Thumbnail
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
  );
}
