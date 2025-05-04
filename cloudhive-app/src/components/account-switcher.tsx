"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import { IconCloudCode } from "@tabler/icons-react";
import useSWR from "swr";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { FaGoogleDrive } from "react-icons/fa6";

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

import { clientAuth } from "@/lib/firebase/firebase-client";
import { fetcher } from "@/utils/apis/fetch";
import { AccountProps } from "@/types/AccountProps";

interface AccountSwitcherProps {
  currentActiveAccount: string | undefined;
  setCurrentActiveAccount: (account: string) => void;
  accounts: AccountProps[];
  oauthUrl: string | undefined;
}

export function AccountSwitcher({
  currentActiveAccount,
  setCurrentActiveAccount,
  accounts,
  oauthUrl,
}: AccountSwitcherProps) {
  const { isMobile } = useSidebar();
  const [user] = useAuthState(clientAuth);
  const router = useRouter();

  // const { data: accounts = [], error: accountsError } = useSWR<Account[]>(
  //   user?.uid ? `api/${user?.uid}/accounts` : null,
  //   fetcher
  // );

  // const { data: oauthUrl, error: oauthUrlError } = useSWR<string>(
  //   user?.uid ? `api/google/${user?.uid}/oauth` : null,
  //   fetcher
  // );

  // if (accountsError) {
  //   throw new Error("Failed to fetch accounts");
  // }

  // if (oauthUrlError) {
  //   throw new Error("Failed to fetch OAuth URL");
  // }

  // Auto-set first account if none is active
  React.useEffect(() => {
    if (!currentActiveAccount && accounts.length > 0) {
      setCurrentActiveAccount(accounts[0].e);
    }
  }, [accounts, currentActiveAccount, setCurrentActiveAccount]);

  const addAccount = () => {
    if (oauthUrl) {
      window.location.href = oauthUrl;
    } else {
      console.warn("Auth URL not available");
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
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
                <span className="truncate text-xl font-semibold">
                  CloudHive
                </span>
                <span className="truncate text-xs">{currentActiveAccount}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            align="start"
            // align={isMobile ? "end" : "start"} // aligns right on mobile
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Accounts
            </DropdownMenuLabel>

            {accounts.length > 0 ? (
              accounts.map((account, index) => (
                <DropdownMenuItem
                  key={account._id}
                  onClick={() => setCurrentActiveAccount(account.e)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <FaGoogleDrive className="text-lg" />
                  </div>
                  {account.e}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))
            ) : (
              // Skeletons (2 placeholders)
              // Array.from({ length: 2 }).map((_, i) => (
              //   <div
              //     key={`skeleton-${i}`}
              //     className="flex items-center gap-2 p-2 animate-pulse"
              //   >
              //     <div className="size-6 rounded-md bg-muted" />
              //     <div className="h-4 flex-1 rounded bg-muted" />
              //     {/* <div className="h-3 w-6 rounded bg-muted ml-auto" /> */}
              //   </div>
              // ))
              <></>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={addAccount} className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Add account
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
