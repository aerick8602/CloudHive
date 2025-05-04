"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { SearchForm } from "@/components/search-form";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { contentMap } from "@/utils/content";
import {
  fetchAccounts,
  fetchOauthUrl,
  verifySession,
} from "@/utils/apis/fetch";
import useSWR from "swr";
import { logoutUser } from "@/utils/apis/post";
import { clientAuth } from "@/lib/firebase/firebase-client";
import { useAuthState } from "react-firebase-hooks/auth";
import { AccountProps } from "@/types/AccountProps";

type CloudHiveProps = {
  accounts: AccountProps[];
  oauthUrl: string;
};

export default function CloudHive({ accounts, oauthUrl }: CloudHiveProps) {
  const [currentActiveAccount, setCurrentActiveAccount] = useState<string>("");
  const [currentParentId, setCurrentParentId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("Drive");
  const [user] = useAuthState(clientAuth);

  useEffect(() => {
    const savedEmail = localStorage.getItem("currentActiveAccount");
    if (savedEmail) {
      setCurrentActiveAccount(savedEmail);
    }
  }, []);

  useEffect(() => {
    if (currentActiveAccount) {
      localStorage.setItem("currentActiveAccount", currentActiveAccount);
    }
  }, [currentActiveAccount]);

  const { data: sessionValid, error: sessionError } = useSWR(
    "api/auth/verify",
    verifySession
  );

  useEffect(() => {
    const checkSession = async () => {
      console.log(sessionValid);
      if (sessionValid == false) {
        await logoutUser("api/auth/logout"); // Log out the user if session is invalid
      }
    };

    checkSession();
  }, [sessionValid]);

  if (sessionError) {
    throw new Error("Session Error");
  }

  //   const { data: accounts = [], error: accountsError } = useSWR<Account[]>(
  //     user?.uid ? `api/${user?.uid}/accounts` : null,
  //     fetchAccounts
  //   );

  //   const { data: oauthUrl, error: oauthUrlError } = useSWR<string>(
  //     user?.uid ? `api/google/${user?.uid}/oauth` : null,
  //     fetchOauthUrl
  //   );

  //   if (accountsError) {
  //     throw new Error("Failed to fetch accounts");
  //   }

  //   if (oauthUrlError) {
  //     throw new Error("Failed to fetch OAuth URL");
  //   }

  const Component = contentMap[activeTab];
  return (
    <SidebarProvider>
      <AppSidebar
        variant="inset"
        accounts={accounts}
        oauthUrl={oauthUrl}
        currentActiveAccount={currentActiveAccount}
        setCurrentActiveAccount={setCurrentActiveAccount}
        currentParentId={currentParentId}
        setActiveTab={setActiveTab}
      />
      <SidebarInset className="overflow-hidden h-[calc(100vh-1rem)]">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 justify-between">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <SearchForm className="w-full sm:ml-auto sm:w-auto" />
          </div>
          <div className="px-3">
            <ModeToggle />
          </div>
        </header>
        <main
          className="flex-1 rounded-md bg-muted/30 mb-2 ml-2 mr-2
  flex flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto">
            {/* MAIN CONTENT */}
            <Component />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
