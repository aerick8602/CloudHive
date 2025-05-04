import { getIconForMimeType } from "@/utils/icons";
import { Thumbnail } from "../thumbnail";
import { FileDropdown } from "../file-dropdown";
import { FileData } from "@/interface";

interface FileCardProps {
  file: FileData;
}

export function FileCard({ file }: FileCardProps) {
  const { icon: Icon, color } = getIconForMimeType(file.mimeType);

  return (
    <div className="aspect-square rounded-lg bg-muted/60 hover:bg-muted/100 transition-all duration-300 p-1 lg:p-2 flex flex-col justify-between">
      <div className="flex items-center justify-between -mt-0.5">
        <div className="flex items-center gap-2 h-full text-center flex-1 min-w-0 p-1 pl-2 pb-2">
          <Icon style={{ color }} className="text-md sm:text-base md:text-lg" />
          <span className="text-sm text-start font-medium text-muted-foreground truncate block flex-1">
            {file.name}
          </span>
          <FileDropdown file={file} />
        </div>
      </div>

      <Thumbnail
        src={`https://drive.google.com/thumbnail?id=${file.id}`}
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
