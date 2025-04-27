"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, User } from "lucide-react";
import { IconCloudCode } from "@tabler/icons-react";
import { redirect } from "next/navigation";

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
import { useAuthState } from "react-firebase-hooks/auth";
import { clientAuth } from "@/lib/firebase/firebase-client";
import axiosInstance from "@/lib/axios";

export function AccountSwitcher() {
  const { isMobile } = useSidebar();
  const [accounts, setAccounts] = React.useState<{ email: string }[]>([]);
  const [authUrl, setAuthUrl] = React.useState<string>("");
  const [activeAccount, setActiveAccount] = React.useState<{ email?: string }>(
    {}
  );
  const [user] = useAuthState(clientAuth);

  // Fetch linked cloud accounts
  const fetchAccounts = async (uid: string) => {
    try {
      const res = await axiosInstance.get(`/accounts`, {
        params: { uid },
      });
      return res.data.accounts as { email: string }[];
    } catch (error: any) {
      console.error("Failed to fetch accounts:", error);
      // throw new Error(
      //   error.response?.data?.error || "Failed to fetch accounts"
      // );
    }
  };

  // Fetch auth URL to add new account
  const fetchAuthUrl = async (uid: string) => {
    try {
      const res = await axiosInstance.get(`/cloud/google`, {
        params: { uid },
      });
      return res.data.authUrl as string; // make sure backend sends { authUrl }
    } catch (error: any) {
      console.error("Failed to fetch auth URL:", error);
      throw new Error(
        error.response?.data?.error || "Failed to fetch auth URL"
      );
    }
  };

  // Load accounts and active account on mount
  React.useEffect(() => {
    const load = async () => {
      if (!user?.uid) return;

      try {
        const [accountsData, authUrlData] = await Promise.all([
          fetchAccounts(user.uid),
          fetchAuthUrl(user.uid),
        ]);

        // Set the authUrl regardless of accountsData being empty
        setAuthUrl(authUrlData);
        console.log("Auth URL:", authUrlData); // Log the authUrl here

        // If accountsData is not empty, set accounts and active account
        if (accountsData && accountsData.length > 0) {
          setAccounts(accountsData);

          const stored = localStorage.getItem("activeAccount");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (
              parsed?.email &&
              accountsData.some((acc) => acc.email === parsed.email)
            ) {
              setActiveAccount(parsed); // Restore previous if exists
            } else {
              setActiveAccount(accountsData[0]); // Pick first if not
            }
          } else {
            setActiveAccount(accountsData[0]); // Set first account if no stored account
          }
        } else {
          console.warn("No accounts found.");
          // Handle the case when no accounts exist (optional)
          // You can show a prompt to add an account or do something else here.
        }
      } catch (error) {
        console.error("Failed to load accounts:", error);
      }
    };

    load();
  }, [user]);

  // Save active account to localStorage when it changes
  React.useEffect(() => {
    if (activeAccount?.email) {
      localStorage.setItem("activeAccount", JSON.stringify(activeAccount));
    }
  }, [activeAccount]);

  // Add a new account by redirecting
  const addAccount = () => {
    console.log(authUrl);
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
              Accounts
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

            <DropdownMenuItem onClick={addAccount} className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add Account
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
