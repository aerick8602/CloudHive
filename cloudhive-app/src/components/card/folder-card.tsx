import { MdFolder, MdFolderShared } from "react-icons/md"; // Import only what you need
import { FileDropdown } from "../file-dropdown";
import { FileData } from "@/interface";

interface FolderCardProps {
  file: FileData;
  onClick?: (folderId: string, email: string, folderName: string) => void;
}

export function FolderCard({ file, onClick }: FolderCardProps) {
  return (
    <div
      className="aspect-[35/12] sm:aspect-[22/6] md:aspect-[18/5] bg-muted/50 hover:bg-muted/100 rounded-md sm:rounded-lg lg:rounded-xl transition-all duration-300 p-4 flex flex-col gap-4 cursor-pointer"
      onDoubleClick={() => onClick?.(file.id, file.email, file.name)}
    >
      <div className="h-full flex items-center justify-between text-center">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {file.permissions.length > 2 ? (
            <MdFolderShared size={26} className="text-muted-foreground" />
          ) : (
            <MdFolder size={26} className="text-muted-foreground" />
          )}
          <span className="text-sm font-medium text-muted-foreground truncate block flex-1 text-start">
            {file.name}
          </span>
        </div>
        <FileDropdown file={file} />
      </div>
    </div>
  );
}
