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
import { AccountProps } from "@/types/AccountProps";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentActiveAccount: string | undefined;
  currentParentId: string | undefined;
  setCurrentActiveAccount: (account: string) => void;
  setActiveTab: (tab: string) => void;
  accounts: AccountProps[];
  oauthUrl: string | undefined;
  folderEmail: string;
  setFolderEmail: (email: string) => void;
}

export function AppSidebar({
  currentParentId,
  currentActiveAccount,
  setCurrentActiveAccount,
  setActiveTab,
  accounts,
  oauthUrl,
  folderEmail,
  setFolderEmail,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AccountSwitcher
          accounts={accounts}
          oauthUrl={oauthUrl}
          currentActiveAccount={currentActiveAccount}
          setCurrentActiveAccount={setCurrentActiveAccount}
        ></AccountSwitcher>
        <Separator />
        <UploadMenu
          currentParentId={currentParentId}
          currentActiveAccount={currentActiveAccount}
          folderEmail={folderEmail}
          setFolderEmail={setFolderEmail}
        ></UploadMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain setActiveTab={setActiveTab} />
        <NavProjects setActiveTab={setActiveTab} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary />
        <NavUser setActiveTab={setActiveTab} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
