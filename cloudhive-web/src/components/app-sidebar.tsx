"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  ClockFading,
  HardDrive,
  Star,
  Trash2,
  Cloudy,
  Image,
  Video,
  AudioLines,
  ArchiveIcon,
  LetterTextIcon,
  FileTerminalIcon,
  Package,
  Database,
  CodeXmlIcon,
} from "lucide-react";

import { IconCloudCode } from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-explorer";
import { NavLog } from "@/components/nav-log";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UploadMenu } from "./upload-menu";

// This is sample data.
const data = {
  log: {
    title: "Dev Console",
    info: "fastapi-server-logs",
    icon: CodeXmlIcon,
  },
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: HardDrive,
      isActive: true,
    },
    {
      title: "Recent",
      url: "#",
      icon: ClockFading,
    },
    {
      title: "Starred",
      url: "#",
      icon: Star,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
    },
    {
      title: "Storage",
      url: "#",
      icon: Cloudy,
    },
  ],
  explorer: [
    {
      title: "Media",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Images",
          icon: Image,
          url: "#",
        },
        {
          title: "Videos",
          icon: Video,
          url: "#",
        },
        {
          title: "Audio",
          icon: AudioLines,
          url: "#",
        },
        {
          title: "Documents",
          icon: FileTerminalIcon,
          url: "#",
        },
        {
          title: "Text",
          icon: LetterTextIcon,
          url: "#",
        },
        {
          title: "Archives",
          icon: Package,
          url: "#",
        },
      ],
    },
    {
      title: "Database",
      url: "#",
      icon: Database,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a className="pointer-events-none hover:bg-transparent hover:text-inherit">
                <IconCloudCode className="!size-6" />
                <span className="text-xl font-semibold">CloudHive</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <UploadMenu />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects items={data.explorer} />
      </SidebarContent>
      <SidebarFooter>
        <NavLog log={data.log} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
