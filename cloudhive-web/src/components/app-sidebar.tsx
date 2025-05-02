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
import { NavUser } from "./nav-user";
import { NavSecondary } from "./nav-secondary";

// This is sample data.
const data = {
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

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  authUrl: string;
  accounts: { email: string; _id: string }[];
  activeEmail: string;
  setActiveEmail: (email: string) => void;
  currentParendId: string | undefined;
  setActiveTab: (tab: string, title: string) => void;
};

export function AppSidebar({
  authUrl,
  accounts,
  activeEmail,
  setActiveEmail,
  currentParendId,
  setActiveTab,
  ...props
}: AppSidebarProps) {
  // const [activeEmail, setActiveEmail] = React.useState<string | undefined>(
  //   undefined
  // );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AccountSwitcher
          accounts={accounts}
          authUrl={authUrl}
          activeEmail={activeEmail}
          setActiveEmail={setActiveEmail}
        />
        <UploadMenu
          activeEmail={activeEmail}
          currentParendId={currentParendId}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={[
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
          ]}
          setActiveTab={setActiveTab}
        />
        <NavProjects
          items={[
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
          ]}
          setActiveTab={setActiveTab}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary className="mt-auto" />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
