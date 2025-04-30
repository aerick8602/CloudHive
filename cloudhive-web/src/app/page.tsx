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

import { DriveCard } from "@/components/drive-card";
import { useAuthState } from "react-firebase-hooks/auth";

import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { clientAuth } from "@/lib/firebase/firebase-client";
import { auth } from "firebase-admin";

import { DriveContent } from "@/components/content/DriveContent";
import { RecentContent } from "@/components/content/RecentContent";
import { StarredContent } from "@/components/content/StarredContent";
import { TrashContent } from "@/components/content/TrashContent";
import { StorageContent } from "@/components/content/StorageContent";
import { ImageContent } from "@/components/content/ImageContent";
import { VideoContent } from "@/components/content/VideoContent";
import { AudioContent } from "@/components/content/AudioContent";
import { DocumentContent } from "@/components/content/DocumentContent";
import { TextContent } from "@/components/content/TextContent";
import { ArchiveContent } from "@/components/content/ArchiveContent";

export default function Page() {
  const { theme, setTheme } = useTheme();
  const [user] = useAuthState(clientAuth);
  const [mounted, setMounted] = useState(false);
  const [isSessionValid, setIsSessionValid] = useState(true);
  const [accounts, setAccounts] = useState<{ email: string }[]>([]);
  const [authUrl, setAuthUrl] = useState<string>("");
  const [activeEmail, setActiveEmail] = useState<string>("");
  const [currentParendId, setCurrentParentId] = useState<string | undefined>(
    undefined
  );
  const [activeTab, setActiveTab] = useState<string>("main");
  const [activeItemTitle, setActiveItemTitle] = useState<string>("Drive");

  const router = useRouter();

  const verifySession = async () => {
    try {
      const response = await axiosInstance.get("/auth/verify");
      const { success } = response.data;
      setIsSessionValid(success);
      return success;
    } catch (error) {
      console.error("Session verification failed:", error);
      setIsSessionValid(false);
      return false;
    }
  };

  const logoutUser = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Error during logout:", error);
      // Optionally redirect anyway or show a toast
    }
  };

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

  useEffect(() => {
    setMounted(true);

    const checkSession = async () => {
      const sessionValid = await verifySession();
      if (!sessionValid) {
        await logoutUser(); // Log out the user if session is invalid
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (!mounted) return;
  }, [mounted]);

  useEffect(() => {
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
  useEffect(() => {
    if (activeEmail) {
      localStorage.setItem("activeEmail", activeEmail);
    }
  }, [activeEmail]);

  const handleTabChange = (tab: string, title: string) => {
    setActiveTab(tab);
    setActiveItemTitle(title);
  };

  if (!mounted || !isSessionValid) return null;

  const isDark = theme === "dark";
  return (
    <SidebarProvider>
      <AppSidebar
        authUrl={authUrl}
        accounts={accounts}
        activeEmail={activeEmail}
        setActiveEmail={setActiveEmail}
        currentParendId={currentParendId}
        setActiveTab={handleTabChange}
      />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 cursor-pointer" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            {/* <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="#">
            Building Your Application
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>Data Fetching</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb> */}
            <SearchForm className="w-full sm:ml-auto sm:w-auto" />
          </div>
          <Button
            className="cursor-pointer"
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
          {/* Inner scrollable content wrapper */}
          <div className="flex-1 overflow-y-auto">
            {/* MAIN DATA SHOWCASE CONTAINER */}
            {activeTab === "main" && (
              <>
                {activeItemTitle === "Drive" && <DriveContent />}
                {activeItemTitle === "Recent" && <RecentContent />}
                {activeItemTitle === "Starred" && <StarredContent />}
                {activeItemTitle === "Trash" && <TrashContent />}
                {activeItemTitle === "Storage" && <StorageContent />}
              </>
            )}
            {activeTab === "explorer" && (
              <>
                {activeItemTitle === "Images" && <ImageContent />}
                {activeItemTitle === "Videos" && <VideoContent />}
                {activeItemTitle === "Audio" && <AudioContent />}
                {activeItemTitle === "Documents" && <DocumentContent />}
                {activeItemTitle === "Text" && <TextContent />}
                {activeItemTitle === "Archives" && <ArchiveContent />}
              </>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
