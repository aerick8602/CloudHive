"use client";

import * as React from "react";
import { Plus, FolderPlus, FileUp, FolderUp } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function UploadMenu() {
  const { isMobile } = useSidebar();

  return (
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
            {/* <DropdownMenuLabel className="text-muted-foreground text-xs flex items-center gap-1">
              <Plus className="size-3" />
              New
            </DropdownMenuLabel> */}

            <DropdownMenuItem
              onClick={() => alert("Create New Folder")}
              className="gap-2 p-2 cursor-pointer"
            >
              <FolderPlus className="size-4" />
              New Folder
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => alert("Upload File")}
              className="gap-2 p-2 cursor-pointer"
            >
              <FileUp className="size-4" />
              File Upload
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => alert("Upload Folder")}
              className="gap-2 p-2 cursor-pointer"
            >
              <FolderUp className="size-4" />
              Folder Upload
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
