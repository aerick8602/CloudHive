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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Copy,
  Download,
  ExternalLinkIcon,
  Info,
  PencilLine,
  Share2Icon,
  Star,
  Trash2,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";
import { CopyWithTick } from "./copy-tick";
import { Separator } from "./ui/separator";
import ShareDialog from "./share-dialog";

export function FileDropdown() {
  const [showRenameDialog, setShowRenameDialog] = React.useState(false);
  const [showShareDialog, setShowShareDialog] = React.useState(false);
  const [showDetailSheet, setShowDetailSheet] = React.useState(false);
  const [folderName, setFolderName] = React.useState("Untitled Folder");

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
            onClick={() =>
              window.open(
                "https://drive.google.com/file/d/1IuJVZy9TPnan0IT9r25tVA5IC84rLxQp",
                "_blank"
              )
            }
            className="gap-2"
          >
            <ExternalLinkIcon className="size-4" />
            Open
            <DropdownMenuShortcut className="text-sm ">⌘O</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => alert("Download")} className="gap-2">
            <Download className="size-4" />
            Download
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setShowRenameDialog(true)}
            className="gap-2"
          >
            <PencilLine className="size-4" />
            Rename
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setShowShareDialog(true)}
            className="gap-2"
          >
            <Share2Icon className="size-4" />
            Share
            <DropdownMenuShortcut className="text-sm ">
              ⌘+S
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => alert("Starred")} className="gap-2">
            <Star className="size-4" />
            Add to Starred
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setShowDetailSheet(true)}
            className="gap-2"
          >
            <Info className="size-4" />
            Info
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => alert("Trash")}
            className="gap-2 text-destructive"
          >
            <Trash2 className="size-4" />
            Move to Trash
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="top-70 lg:top-88">
          <DialogHeader>
            <DialogTitle>Rename</DialogTitle>
            <DialogDescription>
              Give a new name to your file or folder.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="New name"
          />
          <DialogFooter className="mt-4 w-full ">
            <div className="w-full flex justify-between">
              <Button
                variant="outline"
                className=""
                onClick={() => setShowRenameDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className=""
                onClick={() => {
                  // Handle rename action (e.g., save new name)
                  setShowRenameDialog(false);
                }}
              >
                Save
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      ></ShareDialog>

      {/* Detail Sheet */}
      <Sheet open={showDetailSheet} onOpenChange={setShowDetailSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Detail</SheetTitle>
            {/* You can add further description or information here */}
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
}
