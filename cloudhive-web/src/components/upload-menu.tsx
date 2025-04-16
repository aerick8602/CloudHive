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
  const [folderName, setFolderName] = React.useState("");
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
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Create your new folder in one-click.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center">
            <Label htmlFor="folder-name" className="w-16 text-right">
              Name
            </Label>
            <Input
              id="folder-name"
              placeholder="Name of your folder"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="flex-1"
            />
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button className="cursor-pointer">Create</Button>
            </DialogClose>
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
