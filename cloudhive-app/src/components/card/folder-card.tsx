import { FaFolder } from "react-icons/fa6";
import { FileDropdown } from "../file-dropdown";

interface FolderCardProps {
  name: string;
}

export function FolderCard({ name }: FolderCardProps) {
  return (
    <div className="aspect-[35/12] sm:aspect-[22/6] md:aspect-[18/5] bg-muted/50 hover:bg-muted/100 rounded-md sm:rounded-lg lg:rounded-xl transition-all duration-300 p-4 flex flex-col gap-4">
      <div className="h-full flex items-center justify-between text-center">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <FaFolder size={20} className="text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground truncate block flex-1 text-start">
            {name}
          </span>
        </div>
        <FileDropdown />
      </div>
    </div>
  );
}
