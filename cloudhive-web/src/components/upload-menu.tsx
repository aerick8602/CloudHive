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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileData } from "@/app/interface";
import { useAuthState } from "react-firebase-hooks/auth";
import { clientAuth } from "@/lib/firebase/firebase-client";

interface ExtendedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  webkitdirectory?: string;
  directory?: string;
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
  activeEmail: string | undefined;
}

export function UploadMenu({ activeEmail }: UploadMenuProps) {
  const { isMobile } = useSidebar();
  const [folderName, setFolderName] = React.useState("Untitled Folder");
  const [isUploading, setIsUploading] = React.useState(false);
  const [files, setFiles] = React.useState<FileList | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const folderInputRef = React.useRef<HTMLInputElement | null>(null);
  const [user] = useAuthState(clientAuth);

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
            email: activeEmail,
            currentParentId: null,
            userAppEmail: user!.email!,
          }),
        });

        if (response.ok) {
          console.log("Upload successful!");
        } else {
          console.error("Upload failed!");
        }
      } catch (error) {
        console.error("Error during upload:", error);
      } finally {
        setIsUploading(false);
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
    if (!activeEmail) return;
    setIsUploading(true);
    try {
      const res = await fetch("/api/new/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: activeEmail,
          newFolderName: folderName,
          currentParentId: null, // Change if you're supporting nested folders
          userAppEmail: user!.email,
        }),
      });
      if (res.ok) {
        console.log("Folder created!");
      } else {
        console.error("Folder creation failed.");
      }
    } catch (err) {
      console.error("Error creating folder:", err);
    } finally {
      setIsUploading(false);
    }
  };

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
                <DialogTrigger asChild>
                  <DropdownMenuItem className="gap-2 p-2 cursor-pointer">
                    <FolderPlus className="size-4" />
                    New Folder
                  </DropdownMenuItem>
                </DialogTrigger>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="gap-2 p-2 cursor-pointer"
                  disabled={isUploading}
                  onClick={() => triggerFileInput(false)}
                >
                  <FileUp className="size-4" />
                  File Upload
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="gap-2 p-2 cursor-pointer"
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

        {/* New Folder Dialog */}
        <DialogContent className="top-70 lg:top-88">
          <DialogHeader>
            <DialogTitle>New Folder</DialogTitle>
            <DialogDescription>Create a new folder easily.</DialogDescription>
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
                <Button className="cursor-pointer" onClick={createFolder}>
                  Create
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
    </>
  );
}
