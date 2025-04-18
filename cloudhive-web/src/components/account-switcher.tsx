"use client";

import * as React from "react";
import { ChevronsUpDown, MailCheckIcon, Plus, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function AccountSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    email: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem className="p-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar text-sidebar-primary">
                {/* <activeTeam.logo className="size-6" /> */}
                <img src="/icon/Google_Cloud.png"></img>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-lg font-semibold">
                  {activeTeam.name}
                </span>
                <span className="truncate text-xs">{activeTeam.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Account
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.email}
                onClick={() => setActiveTeam(team)}
                className="gap-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {/* <team.logo className="size-4 shrink-0" /> */}
                  {/* <MailCheckIcon /> */}
                  <User></User>
                </div>
                {team.email}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add account
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
