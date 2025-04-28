"use client";

import * as React from "react";
import { Plus, FolderPlus, FileUp, FolderUp, Loader2, X } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { useUploader } from "@/hooks/use-uploder";
import { Progress } from "@/components/ui/progress";

export function UploadMenu() {
  const { isMobile } = useSidebar();
  const [folderName, setFolderName] = React.useState("Untitled Folder");
  const {
    inputRef,
    triggerUpload,
    handleFiles,
    isOpen,
    setIsOpen,
    uploadType,
    setUploadType,
    isUploading,
    setIsUploading,
    uploadProgress,
    setUploadProgress,
    currentFile,
    setCurrentFile,
    totalFiles,
    setTotalFiles,
    uploadedFiles,
    setUploadedFiles,
    currentFileSize,
    setCurrentFileSize,
  } = useUploader();

  return (
    <>
      <Dialog>
        <SidebarMenu>
          <SidebarMenuItem className="p-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={isUploading}>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    {isUploading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Plus className="size-4" />
                    )}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight cursor-pointer">
                    <span className="truncate font-medium">New</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-56 rounded-lg cursor-pointer"
                align="start"
                side={isMobile ? "bottom" : "right"}
                sideOffset={4}
              >
                {/* New Folder triggers dialog */}
                <DialogTrigger asChild>
                  <DropdownMenuItem className="gap-2 p-2 cursor-pointer">
                    <FolderPlus className="size-4" />
                    New Folder
                  </DropdownMenuItem>
                </DialogTrigger>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => {
                    setUploadType("file");
                    setIsUploading(false);
                    setUploadProgress(0);
                    setCurrentFile("");
                    setTotalFiles(0);
                    setUploadedFiles(0);
                    setCurrentFileSize("");
                    triggerUpload("file");
                  }}
                  className="gap-2 p-2 cursor-pointer"
                  disabled={isUploading}
                >
                  <FileUp className="size-4" />
                  File Upload
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    setUploadType("folder");
                    setIsUploading(false);
                    setUploadProgress(0);
                    setCurrentFile("");
                    setTotalFiles(0);
                    setUploadedFiles(0);
                    setCurrentFileSize("");
                    triggerUpload("folder");
                  }}
                  className="gap-2 p-2 cursor-pointer"
                  disabled={isUploading}
                >
                  <FolderUp className="size-4" />
                  Folder Upload
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Dialog Content */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Folder</DialogTitle>
            <DialogDescription>
              Create new folder in just one-click.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-col items-center gap-2">
            <Input
              id="folder-name"
              placeholder="My new folder"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="flex-1"
            />
          </div>
          <DialogFooter className="mt-4 w-full">
            <div className="w-full flex justify-between">
              <DialogClose asChild>
                <Button className="cursor-pointer" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button className="cursor-pointer">Create</Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isUploading && (
        <div className="fixed bottom-4 right-4 w-96 bg-background p-4 rounded-lg shadow-lg border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <FileUp className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-medium">
                  {uploadType === "folder"
                    ? "Uploading folder"
                    : "Uploading file"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {uploadType === "folder"
                    ? `${uploadedFiles} of ${totalFiles} files uploaded`
                    : "Uploading to Google Drive"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => {
                setIsUploading(false);
                setUploadProgress(0);
                setCurrentFile("");
                setTotalFiles(0);
                setUploadedFiles(0);
                setCurrentFileSize("");
              }}
            >
              <X className="size-4" />
            </Button>
          </div>
          <Progress
            value={uploadProgress}
            fileName={currentFile}
            fileSize={currentFileSize}
            isComplete={uploadProgress === 100}
            className="w-full"
          />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple
        onChange={(e) => {
          if (e.target.files) {
            handleFiles(e.target.files);
          }
        }}
      />
    </>
  );
}
