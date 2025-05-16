import { useState } from "react";
import { MdFolder, MdFolderShared } from "react-icons/md"; // Import only what you need
import { FileDropdown } from "../file-dropdown";
import { FileData } from "@/interface";

interface FolderCardProps {
  tab?: string;
  initialStarred?: boolean; // Add this line to include the initialStarred prop
  file: FileData;
  onClick?: (folderId: string, email: string, folderName: string) => void;
  initialView?: boolean; // Optional initial state to control visibility
}

export function FolderCard({
  tab,
  file,
  onClick,
  initialView = true,
  initialStarred = false,
}: FolderCardProps) {
  // Destructure fields from file
  const { id, email, name, permissions, trashed } = file;

  // Manage local state for visibility, trashed status, and name
  const [view, setView] = useState<boolean>(initialView);

  const [localname, setName] = useState<string>(file.name);
  const [localstarred, setStarred] = useState<boolean>(file.starred);
  const [localtrashed, setTrashed] = useState<boolean>(file.trashed);

  if (!view) return null;

  return (
    <div
      className="aspect-[35/12] sm:aspect-[22/6] md:aspect-[18/5] bg-muted/50 hover:bg-muted/100 rounded-md sm:rounded-lg lg:rounded-xl transition-all duration-300 p-4 flex flex-col gap-4 cursor-pointer"
      onDoubleClick={() => onClick?.(id, email, localname)}
    >
      <div className="h-full flex items-center justify-between text-center">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {permissions.length > 2 ? (
            <MdFolderShared size={26} className="text-muted-foreground" />
          ) : (
            <MdFolder size={26} className="text-muted-foreground" />
          )}
          <span className="text-sm font-medium text-muted-foreground truncate block flex-1 text-start">
            {localname}
          </span>
        </div>
        <FileDropdown
          tab={tab}
          localstarred={localstarred}
          setName={setName}
          setView={setView}
          localtrashed={localtrashed}
          file={file}
          setStarred={setStarred}
          // If you want to allow name updates from FileDropdown, you can pass setName here too
        />
      </div>
    </div>
  );
}
