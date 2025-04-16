"use client";

import * as React from "react";
import { Plus, FolderPlus, FileUp, FolderUp } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import { DialogClose } from "@radix-ui/react-dialog";
import { useUploader } from "@/hooks/use-uploder";

export function UploadMenu() {
  const { isMobile } = useSidebar();
  const [folderName, setFolderName] = React.useState("Untitled Folder");
  const { inputRef, triggerUpload, handleFiles } = useUploader();

  return (
    <>
      <Dialog>
        <SidebarMenu>
          <SidebarMenuItem className="p-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Plus className="size-4" />
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
                  onClick={() => triggerUpload("file")}
                  className="gap-2 p-2 cursor-pointer"
                >
                  <FileUp className="size-4" />
                  File Upload
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => triggerUpload("folder")}
                  className="gap-2 p-2 cursor-pointer"
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
              // value={folderName}
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

      <input
        type="file"
        multiple
        hidden
        ref={inputRef}
        onChange={(e) => {
          if (e.target.files) {
            handleFiles(e.target.files);
          }
        }}
      />
    </>
  );
}
