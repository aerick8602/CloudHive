"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { AccountSwitcher } from "./account-switcher";
import { UploadMenu } from "./upload-menu";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { Separator } from "@radix-ui/react-dropdown-menu";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentActiveAccount: string | undefined;
  currentParentId: string | undefined;
  setCurrentActiveAccount: (account: string) => void;
  setActiveTab: (tab: string) => void;
}

export function AppSidebar({
  currentParentId,
  currentActiveAccount,
  setCurrentActiveAccount,
  setActiveTab,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AccountSwitcher
          currentActiveAccount={currentActiveAccount}
          setCurrentActiveAccount={setCurrentActiveAccount}
        ></AccountSwitcher>
        <Separator />
        <UploadMenu
          currentParentId={currentParentId}
          currentActiveAccount={currentActiveAccount}
        ></UploadMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain setActiveTab={setActiveTab} />
        <NavProjects setActiveTab={setActiveTab} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
