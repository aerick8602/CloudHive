import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Download,
  ExternalLinkIcon,
  Info,
  PencilLine,
  Share2Icon,
  Star,
  Trash2,
} from "lucide-react";

import { IoEllipsisVerticalSharp } from "react-icons/io5";

import ShareDialog from "./dialog/share-file";
import RenameFolderDialog from "./dialog/rename-folder";
import FileDetailsSheet from "./sheet/file-details";
import { FileData } from "@/interface";

interface FileDropdownProps {
  file: FileData;
}

export function FileDropdown({ file }: FileDropdownProps) {
  const [showRenameDialog, setShowRenameDialog] = React.useState(false);
  const [showShareDialog, setShowShareDialog] = React.useState(false);
  const [showDetailSheet, setShowDetailSheet] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <IoEllipsisVerticalSharp
            size={18}
            className="text-muted-foreground hover:text-foreground "
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-56 rounded-lg " align="start">
          <DropdownMenuItem
            // Opens the file in a new tab via Google Drive's file viewer
            onClick={() =>
              window.open(
                `https://drive.google.com/file/d/${file.id}/view`,
                "_blank"
              )
            }
            className="gap-2"
          >
            <ExternalLinkIcon className="size-4" />
            Open
            <DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              const link = document.createElement("a");
              link.href = `https://drive.google.com/uc?id=${file.id}&export=download`;
              link.download = file.name || "download"; // optional fallback name
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="gap-2"
          >
            <Download className="size-4" />
            Download
          </DropdownMenuItem>

          <DropdownMenuItem
            // Opens rename dialog to rename the file
            onClick={() => setShowRenameDialog(true)}
            className="gap-2"
          >
            <PencilLine className="size-4" />
            Rename
          </DropdownMenuItem>

          <DropdownMenuItem
            // Opens the share dialog to manage file sharing permissions
            onClick={() => setShowShareDialog(true)}
            className="gap-2"
          >
            <Share2Icon className="size-4" />
            Share
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            // Placeholder for starring the file – can be connected to a backend or API
            onClick={() => alert("Starred")}
            className="gap-2"
          >
            <Star className="size-4" />
            Add to Starred
          </DropdownMenuItem>

          <DropdownMenuItem
            // Opens a bottom sheet showing file metadata and details
            onClick={() => setShowDetailSheet(true)}
            className="gap-2"
          >
            <Info className="size-4" />
            Details
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            // Placeholder for moving file to trash – should trigger a deletion or trash API
            onClick={() => alert("Moved to Trash")}
            className="gap-2 text-destructive"
          >
            <Trash2 className="size-4" />
            Move to Trash
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rename Dialog */}
      <RenameFolderDialog
        open={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        fileName={file.name}
      />

      {/* Share Dialog */}
      <ShareDialog
        file={file}
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      ></ShareDialog>

      {/* Detail Sheet */}
      <FileDetailsSheet
        open={showDetailSheet}
        onOpenChange={setShowDetailSheet}
      ></FileDetailsSheet>
    </>
  );
}
