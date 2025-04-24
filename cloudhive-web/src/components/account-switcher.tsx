"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, User } from "lucide-react";

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
import { redirect } from "next/navigation";
import { IconCloudCode } from "@tabler/icons-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";

export function AccountSwitcher() {
  const { isMobile } = useSidebar();
  const [accounts, setAccounts] = React.useState<{ email: string }[]>([]);
  const [authUrl, setAuthUrl] = React.useState<string>("");
  const [activeAccount, setActiveAccount] = React.useState<{ email?: string }>(
    {}
  );
  const [user, userLoading, userError] = useAuthState(auth);

  // Load from localStorage on mount
  React.useEffect(() => {
    try {
      const storedAccount = localStorage.getItem("activeAccount");
      if (storedAccount) {
        const parsed = JSON.parse(storedAccount);
        if (parsed?.email) {
          setActiveAccount(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to parse activeAccount from localStorage:", error);
    }
  }, []);

  // Save to localStorage when activeAccount changes
  React.useEffect(() => {
    if (activeAccount?.email) {
      localStorage.setItem("activeAccount", JSON.stringify(activeAccount));
    }
  }, [activeAccount]);

  const addAccount = () => {
    if (authUrl) {
      redirect(authUrl);
    } else {
      console.warn("Auth URL not available");
    }
  };

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
                <IconCloudCode className="size-8" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-lg font-semibold">
                  CloudHive
                </span>
                <span className="truncate text-xs">{activeAccount.email}</span>
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
            {accounts.map((account, index) => (
              <DropdownMenuItem
                key={account.email}
                onClick={() => setActiveAccount(account)}
                className="gap-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <User className="size-4 shrink-0" />
                </div>
                {account.email}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div
                className="font-medium text-muted-foreground"
                onClick={addAccount}
              >
                Add account
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
