import { FaFolder } from "react-icons/fa6";
import { FileDropdown } from "../file-dropdown";
import { FileData } from "@/interface";
import { MdFolderShared } from "react-icons/md";
import { Files } from "lucide-react";
import { MdFolder } from "react-icons/md";
<MdFolder />;

interface FolderCardProps {
  file: FileData;
}

export function FolderCard({ file }: FolderCardProps) {
  return (
    <div className="aspect-[35/12] sm:aspect-[22/6] md:aspect-[18/5] bg-muted/50 hover:bg-muted/100 rounded-md sm:rounded-lg lg:rounded-xl transition-all duration-300 p-4 flex flex-col gap-4">
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
