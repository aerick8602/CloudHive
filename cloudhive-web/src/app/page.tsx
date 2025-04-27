"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import Image from "next/image";

import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { FaFileCsv, FaFolder, FaImage } from "react-icons/fa6";
import { getIconForMimeType } from "./utils/icons";
import { FileDropdown } from "@/components/file-dropdown";
import { DriveCard } from "@/components/drive-card";
import { useAuthState } from "react-firebase-hooks/auth";

import { useRouter } from "next/navigation";

export default function Page() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSessionValid, setIsSessionValid] = useState(true);
  const router = useRouter();

  const verifySession = async () => {
    const response = await fetch("/api/auth/verify", { method: "GET" });

    if (!response.ok) {
      setIsSessionValid(false);
      return false;
    }

    const data = await response.json();
    setIsSessionValid(data.success);
    return data.success;
  };

  const logoutUser = async () => {
    const response = await fetch("/api/auth/logout", { method: "POST" });

    if (response.ok) {
      router.push("/auth/sign-in"); // Redirect to sign-in page after logging out
    } else {
      console.error("Error during logout");
      // Handle logout error, maybe show a toast or log out anyway
    }
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

  if (!mounted || !isSessionValid) return null;

  const isDark = theme === "dark";
  return (
    <SidebarProvider>
      <AppSidebar />
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

        <div className="flex-1 rounded-xl bg-muted/20 m-2 md:min-h-min h-[100vh] flex flex-col overflow-hidden">
          {/* Inner scrollable content wrapper */}
          <div className="flex-1 overflow-y-auto max-h-[88vh] flex flex-col gap-6 p-1 sm:p-3 md:p-5 lg:p-8 pt-0">
            <DriveCard />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
