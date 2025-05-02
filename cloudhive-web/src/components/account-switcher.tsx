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

interface AccountSwitcherProps {
  activeEmail?: string;
  setActiveEmail: (email: string) => void;
}

export function AccountSwitcher({
  activeEmail,
  setActiveEmail,
}: AccountSwitcherProps) {
  const { isMobile } = useSidebar();
  const [accounts, setAccounts] = React.useState<{ email: string }[]>([]);
  const [authUrl, setAuthUrl] = React.useState<string>("");

  const [user] = useAuthState(clientAuth);

  // Fetch linked cloud accounts
  const fetchAccounts = async (uid: string) => {
    const res = await axiosInstance.get(`/accounts`, { params: { uid } });
    return res.data.accounts as { email: string }[];
  };
  // Fetch auth URL to add new account
  const fetchAuthUrl = async (uid: string) => {
    const res = await axiosInstance.get(`/cloud/google`, { params: { uid } });
    return res.data.authUrl as string;
  };

  // Load accounts and set active email
  React.useEffect(() => {
    const load = async () => {
      if (!user?.uid) return;

      try {
        const [accountsData, authUrlData] = await Promise.all([
          fetchAccounts(user.uid),
          fetchAuthUrl(user.uid),
        ]);

        setAuthUrl(authUrlData);
        setAccounts(accountsData);

        const storedEmail = localStorage.getItem("activeEmail");
        if (storedEmail && accountsData.some((a) => a.email === storedEmail)) {
          setActiveEmail(storedEmail);
        } else if (accountsData.length > 0) {
          setActiveEmail(accountsData[0].email);
        }
      } catch (err) {
        console.error("Failed to load accounts:", err);
      }
    };

    load();
  }, [user]);

  // Save active email to localStorage
  React.useEffect(() => {
    if (activeEmail) {
      localStorage.setItem("activeEmail", activeEmail);
    }
  }, [activeEmail]);

  // Redirect to add account
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
                <span className="truncate text-xs">{activeEmail}</span>
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
                onClick={() => setActiveEmail(account.email)}
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
