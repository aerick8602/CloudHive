"use client";

import * as React from "react";
import { Plus, FolderPlus, FileUp, FolderUp, Loader2 } from "lucide-react";
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
import { mutate } from "swr";

import { useAuthState } from "react-firebase-hooks/auth";
import { clientAuth } from "@/lib/firebase/firebase-client";
import { NewFolderDialog } from "./dialog/new-folder";

interface FileData {
  path: string;
  name: string;
  size: number;
  type: string;
  file: string;
}

async function prepareUploadData(
  files: FileList | null,
  isFolder: boolean = false
): Promise<FileData[]> {
  const fileData: FileData[] = [];
  if (files) {
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      const path = isFolder ? file.webkitRelativePath : file.name;
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      fileData.push({
        path,
        name: file.name,
        size: file.size,
        type: file.type,
        file: base64,
      });
    }
  }
  return fileData;
}

interface UploadMenuProps {
  currentActiveAccount: string | undefined;
  currentParentId: string | undefined;
}

export function UploadMenu({
  currentActiveAccount,
  currentParentId = undefined,
}: UploadMenuProps) {
  const { isMobile } = useSidebar();
  const [folderName, setFolderName] = React.useState("Untitled Folder");
  const [isUploading, setIsUploading] = React.useState(false);
  const [files, setFiles] = React.useState<FileList | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const folderInputRef = React.useRef<HTMLInputElement | null>(null);
  const [user] = useAuthState(clientAuth);
  const [openNewFolderDialog, setOpenNewFolderDialog] = React.useState(false);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isFolder: boolean = false
  ) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      setFiles(selectedFiles);
      setIsUploading(true);

      try {
        const fileData = await prepareUploadData(selectedFiles, isFolder);
        const response = await fetch("/api/new/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            files: fileData,
            isFolder,
            email: currentActiveAccount,
            currentParentId: currentParentId,
            userAppEmail: user!.email!,
          }),
        });

        if (response.ok) {
          console.log("Upload successful!");
          // Mutate all relevant queries to refresh the data
          if (currentParentId === "root" || !currentParentId) {
            // If in root, refresh all files
            mutate(`/api/file/all/${user!.uid}?trashed=false`);
          } else {
            // If in a specific folder, refresh that folder's contents
            mutate(`/api/file/${currentActiveAccount}?parentId=${currentParentId}&trashed=false`);
          }
        } else {
          console.error("Upload failed!");
        }
      } catch (error) {
        console.error("Error during upload:", error);
      } finally {
        setIsUploading(false);
        setFiles(null);
      }
    }
  };

  const triggerFileInput = (isFolder: boolean = false) => {
    if (isFolder) {
      folderInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  const createFolder = async () => {
    if (!currentActiveAccount) return;
    setIsUploading(true);
    try {
      const res = await fetch("/api/new/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: currentActiveAccount,
          newFolderName: folderName,
          currentParentId: currentParentId,
          userAppEmail: user!.email,
        }),
      });
      if (res.ok) {
        console.log("Folder created!");
        // Mutate all relevant queries to refresh the data
        if (currentParentId === "root" || !currentParentId) {
          // If in root, refresh all files
          mutate(`/api/file/all/${user!.uid}?trashed=false`);
        } else {
          // If in a specific folder, refresh that folder's contents
          mutate(`/api/file/${currentActiveAccount}?parentId=${currentParentId}&trashed=false`);
        }
      } else {
        console.error("Folder creation failed.");
      }
    } catch (err) {
      console.error("Error creating folder:", err);
    } finally {
      setIsUploading(false);
      setOpenNewFolderDialog(false);
      setFolderName("Untitled Folder");
    }
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem className="p-0">
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              disabled={isUploading || !currentActiveAccount}
            >
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {isUploading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight ">
                  <span className="truncate font-medium">New</span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-56 rounded-lg "
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuItem
                className="gap-2 p-2 "
                onClick={() => setOpenNewFolderDialog(true)}
              >
                <FolderPlus className="size-4" />
                New Folder
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="gap-2 p-2 "
                disabled={isUploading}
                onClick={() => triggerFileInput(false)}
              >
                <FileUp className="size-4" />
                File Upload
              </DropdownMenuItem>

              <DropdownMenuItem
                className="gap-2 p-2 "
                disabled={isUploading}
                onClick={() => triggerFileInput(true)}
              >
                <FolderUp className="size-4" />
                Folder Upload
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Hidden input fields */}
      <input
        type="file"
        className="hidden"
        multiple
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e, false)}
      />
      <input
        type="file"
        className="hidden"
        multiple
        // @ts-ignore
        webkitdirectory=""
        // @ts-ignore
        directory=""
        ref={folderInputRef}
        onChange={(e) => handleFileChange(e, true)}
      />

      {/* New Folder Dialog */}
      <NewFolderDialog
        open={openNewFolderDialog}
        onOpenChange={setOpenNewFolderDialog}
        folderName={folderName}
        setFolderName={setFolderName}
        createFolder={createFolder}
      />
    </>
  );
}
