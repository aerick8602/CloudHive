import React from "react";
import axios from "axios";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Download,
  ExternalLinkIcon,
  EyeIcon,
  Info,
  PencilLine,
  Share2Icon,
  Star,
  Trash2,
} from "lucide-react";

import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { MdOpenWith, MdRestore } from "react-icons/md";

import ShareDialog from "./dialog/share-file";
import RenameFolderDialog from "./dialog/rename-folder";
import FileDetailsSheet from "./sheet/file-details";
import { FileData } from "@/interface";

import { toast } from "sonner";
import { set } from "date-fns";
import { Separator } from "@radix-ui/react-dropdown-menu";

interface FileDropdownProps {
  tab?: string;
  file: FileData;
  localtrashed: boolean;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setView: React.Dispatch<React.SetStateAction<boolean>>;
  setStarred: React.Dispatch<React.SetStateAction<boolean>>;
  localstarred: boolean;
  onFolderClick?: (folderId: string, email: string, folderName: string) => void;
  setShowPreview?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function FileDropdown({
  tab,
  setShowPreview,
  localstarred,
  file,
  localtrashed,
  setName,
  setView,
  setStarred,
  onFolderClick,
}: FileDropdownProps) {
  const [showRenameDialog, setShowRenameDialog] = React.useState(false);
  const [showShareDialog, setShowShareDialog] = React.useState(false);
  const [showDetailSheet, setShowDetailSheet] = React.useState(false);

  async function updateFile(
    updateFields: Record<string, any>,
    showUndoToast = false,
    undoCallback?: () => void
  ) {
    try {
      const res = await axios.post(
        `/api/file/${file.email}/update/${file.id}`,
        updateFields
      );

      console.log("File updated:", res.data);

      if (showUndoToast) {
        let message = "Updated";

        if (updateFields.starred !== undefined) {
          message = updateFields.starred
            ? "File added to Favorites."
            : "File removed from Favorites.";
        } else if (updateFields.trashed !== undefined) {
          message = updateFields.trashed
            ? "File moved to Trash."
            : "File restored from Trash.";
        } else if (updateFields.name !== undefined) {
          message = "File name updated successfully.";
        } else if (updateFields.shared !== undefined) {
          message = updateFields.shared
            ? "File shared with others."
            : "File sharing permissions removed";
        }

        toast.success(message, {
          action: undoCallback
            ? {
                label: "Undo",
                onClick: undoCallback,
              }
            : undefined,
        });
      }

      if (updateFields.trashed === true && setView) {
        setView(false);
      }

      if (updateFields.permanentlyDelete === true && setView) {
        setView(false);
        toast("Deleted permanently");
      }
    } catch (error) {
      console.error("Failed to update file:", error);
      alert("Failed to update file");
    }
  }

  // Undo helpers:
  function undoStar(oldStarred: boolean) {
    updateFile({ starred: oldStarred }, false);
    toast.info("Action Undone");
    setStarred(oldStarred); // rollback UI immediately on undo
    setView(true);
  }

  function undoTrash(oldTrashed: boolean) {
    updateFile({ trashed: oldTrashed }, false);
    setView(!oldTrashed);
    toast.info("Action Undone");
  }

  function undoRename(oldName: string) {
    updateFile({ name: oldName }, false);
    setName(oldName); // rollback UI name immediately on undo
    toast.info("Action Undone");
  }

  function undoShare(oldShared: boolean) {
    updateFile({ shared: oldShared }, false);
    toast.info("Action Undone");
  }

  function undoRestore(oldTrashed: boolean) {
    updateFile({ trashed: oldTrashed }, false);
    setView(true);
    toast.info("Action Undone");
  }

  function onRenameSuccess(newName: string) {
    const oldName = file.name;
    setName(newName); // <-- update UI immediately
    updateFile({ name: newName }, true, () => undoRename(oldName));
    setShowRenameDialog(false);
  }

  const handleDownload = async () => {
    if (file.mimeType === "application/vnd.google-apps.folder") {
      // For folders, use our custom download endpoint
      const link = document.createElement("a");
      link.href = `/api/file/${file.email}/download-folder/${file.id}`;
      link.download = `${file.name}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For files, use the existing Google Drive download URL
      const link = document.createElement("a");
      link.href = `https://drive.google.com/uc?id=${file.id}&export=download`;
      link.download = file.name || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <IoEllipsisVerticalSharp
            size={18}
            className="text-muted-foreground hover:text-foreground"
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="min-w-56 rounded-lg" align="start">
          {localtrashed ? (
            <>
              <DropdownMenuItem
                onClick={async () => {
                  await updateFile({ trashed: false }, true); // show toast but no undo
                  setView(false);
                }}
                className="gap-2"
              >
                <MdRestore className="size-4" />
                Restore
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => updateFile({ permanentlyDelete: true })}
                className="gap-2 text-destructive"
              >
                <Trash2 className="size-4" />
                Delete Forever
              </DropdownMenuItem>
            </>
          ) : (
            <>
              {file.mimeType === "application/vnd.google-apps.folder" ? (
                <DropdownMenuItem
                  onClick={() =>
                    onFolderClick?.(file.id, file.email, file.name)
                  }
                  className="gap-2"
                >
                  <MdOpenWith className="size-4" />
                  Open
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="gap-2">
                      <MdOpenWith className="size-4" />
                      Open
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="md:min-w-56 rounded-lg">
                      <DropdownMenuItem
                        onClick={() => setShowPreview?.(true)}
                        className="gap-2"
                      >
                        <EyeIcon className="size-4" />
                        Preview
                        {/* <DropdownMenuShortcut>⌘P</DropdownMenuShortcut> */}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          window.open(
                            `https://drive.google.com/file/d/${file.id}/view`,
                            "_blank"
                          )
                        }
                        className="gap-2"
                      >
                        <ExternalLinkIcon className="size-4" />
                        Open in New Tab
                        {/* <DropdownMenuShortcut>⌘O</DropdownMenuShortcut> */}
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDownload} className="gap-2">
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
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  setStarred(!localstarred);
                  updateFile({ starred: !localstarred }, true, () =>
                    undoStar(localstarred)
                  );

                  if (tab === "Starred") {
                    setTimeout(() => {
                      setView(false);
                    }, 1000); // 1 second delay
                  }
                }}
                className="gap-2"
              >
                <Star className="size-4" />
                {localstarred ? "Remove from Starred" : "Add to Starred"}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setShowDetailSheet(true)}
                className="gap-2"
              >
                <Info className="size-4" />
                Details
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() =>
                  updateFile({ trashed: true }, true, () =>
                    undoTrash(localtrashed)
                  )
                }
                className="gap-2 text-destructive"
              >
                <Trash2 className="size-4" />
                Move to Trash
                <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs & Bottom Sheet */}
      <RenameFolderDialog
        open={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        fileName={file.name}
        onRenameSuccess={onRenameSuccess}
      />

      <ShareDialog
        file={file}
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      />

      <FileDetailsSheet
        open={showDetailSheet}
        onOpenChange={setShowDetailSheet}
        file={file}
      />
    </>
  );
}
