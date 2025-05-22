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
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

import { useAuthState } from "react-firebase-hooks/auth";
import { clientAuth } from "@/lib/firebase/firebase-client";
import { NewFolderDialog } from "./dialog/new-folder";
import { UploadToast, UploadErrorToast } from "./upload-toast";

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
  folderEmail: string;
  setFolderEmail: (email: string) => void;
}

function formatProgress(progress: number) {
  return `${Math.round(progress)}%`;
}

export function UploadMenu({
  currentActiveAccount,
  folderEmail,
  setFolderEmail,
  currentParentId = undefined,
}: UploadMenuProps) {
  const { isMobile } = useSidebar();
  const [folderName, setFolderName] = React.useState("Untitled Folder");
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
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
    if (!selectedFiles || selectedFiles.length === 0) {
      return; // Exit early if no files are selected
    }

    setFiles(selectedFiles);
    setIsUploading(true);
    setUploadProgress(0);

    const totalFiles = selectedFiles.length;
    const fileText = totalFiles === 1 ? "file" : "files";

    // Show initial loading toast
    const promise = new Promise((resolve, reject) => {
      const handleUpload = async () => {
        let toastId: string | number = "";
        try {
          const fileData = await prepareUploadData(selectedFiles, isFolder);

          // Create initial toast and store its ID
          toastId = toast(
            <UploadToast
              progress={0}
              totalFiles={totalFiles}
              fileText={fileText}
              status="Preparing files..."
            />,
            {
              duration: Infinity,
              // duration: 5000,
              unstyled: true,
              // closeButton: true,
            }
          );

          const response = await fetch("/api/new/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              files: fileData,
              isFolder,
              email: currentParentId ? folderEmail : currentActiveAccount,
              currentParentId: currentParentId,
              userAppEmail: user!.email!,
            }),
          });

          if (!response.ok) {
            throw new Error("Upload failed");
          }

          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error("No response body");
          }

          const decoder = new TextDecoder();
          let buffer = "";
          let hasError = false;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.progress !== undefined) {
                    setUploadProgress(data.progress);
                    // Update the existing toast with new progress
                    toast(
                      <UploadToast
                        progress={data.progress}
                        totalFiles={totalFiles}
                        fileText={fileText}
                        status={data.status}
                        onClose={() => toast.dismiss(toastId)}
                      />,
                      {
                        id: toastId,
                        duration: Infinity,
                        // duration: 5000,
                        unstyled: true,
                        // closeButton: true,
                      }
                    );
                  }
                  if (data.error) {
                    hasError = true;
                    reject(new Error(data.error));
                  }
                } catch (e) {
                  console.error("Error parsing SSE data:", e);
                  hasError = true;
                  reject(e);
                }
              }
            }
          }

          // Only resolve if no errors occurred
          if (!hasError) {
            // Mutate all relevant queries to refresh the data
            if (currentParentId === "root" || !currentParentId) {
              mutate(`/api/file/all/${user!.uid}?trashed=false`);
            } else {
              mutate(
                `/api/file/${currentActiveAccount}?parentId=${currentParentId}&trashed=false`
              );
            }
            resolve("Upload complete!");
          }
        } catch (error) {
          // Dismiss the previous toast before showing error
          if (toastId) {
            toast.dismiss(toastId);
          }
          reject(error);
        } finally {
          setIsUploading(false);
          setFiles(null);
          setUploadProgress(0);
        }
      };

      handleUpload();
    });

    // Handle error case
    promise.catch((error) => {
      // Only show error toast if it's a real error
      if (error.message !== "Upload complete!") {
        toast.dismiss();
        toast(
          <UploadErrorToast
            totalFiles={totalFiles}
            fileText={fileText}
            progress={uploadProgress}
          />,
          {
            unstyled: true,
            duration: 2000,
            // closeButton: true,
          }
        );
      }
    });
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
          email: currentParentId ? folderEmail : currentActiveAccount,
          newFolderName: folderName,
          currentParentId: currentParentId,
          userAppEmail: user!.email!,
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
          mutate(
            `/api/file/${currentActiveAccount}?parentId=${currentParentId}&trashed=false`
          );
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
                className={`
                  data-[state=open]:bg-sidebar-accent 
                  data-[state=open]:text-sidebar-accent-foreground
                  disabled:opacity-50 
                  disabled:cursor-not-allowed
                  transition-colors
                  hover:bg-sidebar-accent/50
                `}
              >
                <div
                  className={`
                  flex aspect-square size-8 items-center justify-center 
                  rounded-lg bg-sidebar-primary text-sidebar-primary-foreground
                  transition-colors
                  group-hover:bg-sidebar-primary/90
                `}
                >
                  {isUploading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">New</span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-[200px] rounded-lg p-1.5"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuItem
                className={`
                  flex items-center gap-2 rounded-md px-2 py-2 text-sm
                  hover:bg-accent hover:text-accent-foreground
                  focus:bg-accent focus:text-accent-foreground
                  cursor-pointer
                  transition-colors
                  ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
                `}
                onClick={() => !isUploading && setOpenNewFolderDialog(true)}
                disabled={isUploading}
              >
                <FolderPlus className="size-4 shrink-0" />
                <span>New Folder</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1" />

              <DropdownMenuItem
                className={`
                  flex items-center gap-2 rounded-md px-2 py-2 text-sm
                  hover:bg-accent hover:text-accent-foreground
                  focus:bg-accent focus:text-accent-foreground
                  cursor-pointer
                  transition-colors
                  ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
                `}
                disabled={isUploading}
                onClick={() => !isUploading && triggerFileInput(false)}
              >
                <FileUp className="size-4 shrink-0" />
                <span>File Upload</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className={`
                  flex items-center gap-2 rounded-md px-2 py-2 text-sm
                  hover:bg-accent hover:text-accent-foreground
                  focus:bg-accent focus:text-accent-foreground
                  cursor-pointer
                  transition-colors
                  ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
                `}
                disabled={isUploading}
                onClick={() => !isUploading && triggerFileInput(true)}
              >
                <FolderUp className="size-4 shrink-0" />
                <span>Folder Upload</span>
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
        accept="*/*"
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
