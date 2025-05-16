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
import { fetcher } from "@/utils/apis/fetch";
import useSWR from "swr";
import { logoutUser } from "@/utils/apis/post";
import { clientAuth } from "@/lib/firebase/firebase-client";
import { useAuthState } from "react-firebase-hooks/auth";
import { AccountProps } from "@/types/AccountProps";

interface CloudHiveProps {
  initialAccounts: AccountProps[];
  initialOauthUrl: string;
  uid: string;
}

export default function CloudHive({
  uid,
  initialAccounts,
  initialOauthUrl,
}: CloudHiveProps) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [oauthUrl, setOauthUrl] = useState(initialOauthUrl);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAccountsAndOauth() {
      setLoading(true);
      try {
        const resAccounts = await fetch(`/api/${uid}/accounts`);
        const dataAccounts = await resAccounts.json();
        setAccounts(dataAccounts.accounts?.[0] || []);

        const resOauth = await fetch(`/api/google/${uid}/oauth`);
        const dataOauth = await resOauth.text();
        setOauthUrl(dataOauth);
      } catch (error) {
        console.error("Error fetching accounts or OAuth URL:", error);
      }
      setLoading(false);
    }

    // Fetch only if initial data was empty
    if (!initialAccounts.length || !initialOauthUrl) {
      fetchAccountsAndOauth();
    }
  }, [uid, initialAccounts.length, initialOauthUrl]);

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

  // const { data: sessionValid, error: sessionError } = useSWR(
  //   "api/auth/verify",
  //   fetcher
  // );

  // useEffect(() => {
  //   const checkSession = async () => {
  //     console.log(sessionValid);
  //     if (sessionValid == false) {
  //       await logoutUser("api/auth/logout"); // Log out the user if session is invalid
  //     }
  //   };

  //   checkSession();
  // }, [sessionValid]);

  // if (sessionError) {
  //   throw new Error("Session Error");
  // }

  //   const { data: accounts = [], error: accountsError } = useSWR<Account[]>(
  //     user?.uid ? `api/${user?.uid}/accounts` : null,
  //     fetcher
  //   );

  //   const { data: oauthUrl, error: oauthUrlError } = useSWR<string>(
  //     user?.uid ? `api/google/${user?.uid}/oauth` : null,
  //     fetcher
  //   );

  //   if (accountsError) {
  //     throw new Error("Failed to fetch accounts");
  //   }

  //   if (oauthUrlError) {
  //     throw new Error("Failed to fetch OAuth URL");
  //   }

  const Component = contentMap[activeTab];
  if (loading)
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden bg-white ">
        <video
          src="/loading.mp4"
          autoPlay
          loop
          muted
          className="w-100 h-100 object-cover"
        />
        <div className=" flex flex-col items-center justify-center  select-none  z-10 px-4">
          <h1 className="text-5xl font-extrabold tracking-wide ">CloudHive</h1>
          <p className="mt-4 text-md opacity-80">
            Loading your cloud accounts...
          </p>
        </div>
      </div>
    );

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
      <SidebarInset className="h-[calc(100vh-1rem)]">
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
        <main className=" relative flex-1 rounded-md bg-muted/25 mb-2 ml-2 mr-2 flex flex-col overflow-hidden">
          <Component uid={uid} accounts={accounts} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
