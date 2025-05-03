"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SearchForm } from "@/components/search-form";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { clientAuth } from "@/lib/firebase/firebase-client";

import { fetchAccounts, fetchAuthUrl } from "@/utils/apis/fetcher";
import { fetchSession, logoutUser } from "@/utils/apis/auth";
import { contentArray } from "@/utils/content";

export default function Page() {
  const { theme, setTheme } = useTheme();
  const [user] = useAuthState(clientAuth);
  const [mounted, setMounted] = useState(false);

  const [activeEmail, setActiveEmail] = useState<string>("");
  const [currentParendId, setCurrentParentId] = useState<string | undefined>(
    undefined
  );
  const [activeTab, setActiveTab] = useState<string>("main");
  const [activeItemTitle, setActiveItemTitle] = useState<string>("Drive");

  const router = useRouter();

  const [userUID, setUserUID] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUserUID(user.uid);
    }
  }, [user]);

  const { data: accounts = [], error: accountsError } = useSWR(
    userUID ? userUID : null, // Trigger only after UID is available
    fetchAccounts
  );

  const { data: authUrl = "", error: authUrlError } = useSWR(
    userUID ? `/google/oauth/${userUID}` : null, // Trigger after UID is available
    fetchAuthUrl
  );

  const { data: sessionValid, error: sessionError } = useSWR(
    "/auth/verify",
    fetchSession
  );

  useEffect(() => {
    setMounted(true);

    const checkSession = async () => {
      if (sessionValid === false) {
        await logoutUser(); // Log out the user if session is invalid
      }
    };

    checkSession();
  }, [sessionValid]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("activeEmail");
    if (savedEmail) {
      setActiveEmail(savedEmail);
    }
  }, []);

  useEffect(() => {
    if (activeEmail) {
      localStorage.setItem("activeEmail", activeEmail);
    }
  }, [activeEmail]);

  const handleTabChange = (tab: string, title: string) => {
    setActiveTab(tab);
    setActiveItemTitle(title);
  };
  const Component = contentArray[activeTab][activeItemTitle];

  if (!mounted || sessionValid === undefined) return null;

  const isDark = theme === "dark";
  return (
    <SidebarProvider>
      <AppSidebar
        variant="floating"
        authUrl={authUrl || ""}
        accounts={accounts}
        activeEmail={activeEmail}
        setActiveEmail={setActiveEmail}
        currentParendId={currentParendId}
        setActiveTab={handleTabChange}
      />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 " />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <SearchForm className="w-full sm:ml-auto sm:w-auto" />
          </div>
          <Button
            className=""
            variant="outline"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </header>

        <div className="flex-1 rounded-xl bg-muted/20 m-2 max-h-[88.5vh] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <Component />;
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
