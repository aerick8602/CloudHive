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
  Images,
  Podcast,
  GalleryVerticalEnd,
  Clapperboard,
  AudioWaveform,
  Command,
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
import { AccountSwitcher } from "./account-switcher";

// This is sample data.
const data = {
  account: [
    {
      email: "katiyara089@gmail.com",
    },
    {
      email: "maverick8602@gmail.com",
    },
    {
      email: "clashofclan080602@gmail.com",
    },
  ],
  navMain: [
    {
      title: "Drive",
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
      icon: Clapperboard,
      isActive: false,
      items: [
        {
          title: "Images",
          icon: Images,
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
        <AccountSwitcher />
        <UploadMenu />
        {/* <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-0 -translate-x-1"
            >
              <a className="pointer-events-none hover:bg-transparent hover:text-inherit ">
                <IconCloudCode className="!size-7 flex items-center justify-center" />
                <span className="text-xl font-semibold">CloudHive</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects items={data.explorer} />
      </SidebarContent>
      <SidebarFooter>
        <NavLog />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
