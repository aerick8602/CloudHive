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
  const abortControllerRef = React.useRef<AbortController | null>(null);

  // Add beforeunload event listener
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isUploading) {
        e.preventDefault();
        e.returnValue =
          "You have an ongoing upload. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isUploading]);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isFolder: boolean = false
  ) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    setFiles(selectedFiles);
    setIsUploading(true);
    setUploadProgress(0);

    const totalFiles = selectedFiles.length;
    const fileText = totalFiles === 1 ? "file" : "files";

    // Create abort controller for this upload
    abortControllerRef.current = new AbortController();

    const promise = new Promise((resolve, reject) => {
      const handleUpload = async () => {
        let toastId: string | number = "";
        try {
          const formData = new FormData();
          Array.from(selectedFiles).forEach((file, index) => {
            const path = isFolder ? file.webkitRelativePath : file.name;
            formData.append(`file-${index}`, file);
            formData.append(`path-${index}`, path);
          });

          // Add metadata
          formData.append("isFolder", String(isFolder));
          formData.append(
            "email",
            currentParentId ? folderEmail : currentActiveAccount!
          );
          if (currentParentId)
            formData.append("currentParentId", currentParentId);
          formData.append("userAppEmail", user!.email!);
          formData.append("totalFiles", String(totalFiles));

          // Set timeout for upload (5 minutes)
          const timeoutId = setTimeout(() => {
            abortControllerRef.current?.abort();
            reject(new Error("Upload timed out"));
          }, 300000);

          // Initial toast
          toastId = toast(
            <UploadToast
              progress={0}
              totalFiles={totalFiles}
              fileText={fileText}
              status="Preparing files..."
            />,
            { duration: Infinity, unstyled: true }
          );

          const response = await fetch("/api/new/upload", {
            method: "POST",
            body: formData,
            signal: abortControllerRef.current?.signal,
            keepalive: true,
          });

          clearTimeout(timeoutId);

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
                    toast(
                      <UploadToast
                        progress={data.progress}
                        totalFiles={totalFiles}
                        fileText={fileText}
                        status={data.status}
                        onClose={() => toast.dismiss(toastId)}
                      />,
                      { id: toastId, duration: Infinity, unstyled: true }
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

          if (!hasError) {
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
          if (toastId) toast.dismiss(toastId);
          reject(error);
        } finally {
          setIsUploading(false);
          setFiles(null);
          setUploadProgress(0);
          abortControllerRef.current = null;
        }
      };

      handleUpload();
    });

    promise.catch((error) => {
      if (error.message !== "Upload complete!") {
        toast.dismiss();
        toast(
          <UploadErrorToast
            totalFiles={totalFiles}
            fileText={fileText}
            progress={uploadProgress}
          />,
          { unstyled: true, duration: 2000 }
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
        if (currentParentId === "root" || !currentParentId) {
          mutate(`/api/file/all/${user!.uid}?trashed=false`);
        } else {
          mutate(
            `/api/file/${currentActiveAccount}?parentId=${currentParentId}&trashed=false`
          );
        }
      }
    } catch (err) {
      console.error("Error creating folder:", err);
    } finally {
      setIsUploading(false);
      setOpenNewFolderDialog(false);
      setFolderName("Untitled Folder");
    }
  };

  // Cancel upload when component unmounts
  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
