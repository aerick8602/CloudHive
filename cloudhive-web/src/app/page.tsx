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
const dummyFile = {
  id: "1GEdkhlbg8FnW-MsBv6McRuGalT3DRFl3",
  fileName: "AYUSH KATIYAR RESUME.pdf",
  mimeType: "application/pdf",

  iconLink:
    "https://drive-thirdparty.googleusercontent.com/16/type/application/pdf",
  thumbnailLink:
    "https://lh3.googleusercontent.com/drive-storage/AJQWtBPJlPwnP9wUbF-VzcZNEebMpYt02cJ-qQgtKTbCT65CYXkVcee9Kumh5WdL_UgavyVGHpw6-k7vlNDrv9KruLmv0aZIkXhCugcxhnMnDHKSBuA=s220",
  webViewLink:
    "https://drive.google.com/file/d/1GEdkhlbg8FnW-MsBv6McRuGalT3DRFl3/view?usp=drivesdk",
  isStarred: false,
  isTrashed: false,
  modifiedTime: "2025-04-16T14:35:58.295Z",
  provider: "google",
};
const dummyFile1 = {
  id: "1GEdkhlbg8FnW-MsBv6McRuGalT3DRFl3",
  fileName: "naruto.jpeg",
  mimeType: "application/pdf",
  iconLink: "https://drive-thirdparty.googleusercontent.com/16/type/image/jpeg",
  thumbnailLink:
    "https://lh3.googleusercontent.com/drive-storage/AJQWtBOo7U7UuK-5yKKMwIQ-H1aW_Psa9PBHWv_XZ1MyVF8_2lnwtAeQn44AMxSsv4V8QK7de98PKYZMhCxoQKbthbFmsDCXXwm42nFurqFCZ8PcZQ=s220",
  webViewLink:
    "https://drive.google.com/file/d/1GEdkhlbg8FnW-MsBv6McRuGalT3DRFl3/view?usp=drivesdk",
  isStarred: false,
  isTrashed: false,
  modifiedTime: "2025-04-16T14:35:58.295Z",
  provider: "google",
};

import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import Image from "next/image";

import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { FaFileCsv, FaFolder, FaImage } from "react-icons/fa6";
import { getIconForMimeType } from "./utils/icons";
import { FileDropdown } from "@/components/file-dropdown";

export default function Page() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { icon: Icon, color } = getIconForMimeType(dummyFile.mimeType);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
        <div className="flex flex-1 flex-col gap-6 p-2 sm:p-4 md:p-6 lg:p-10 pt-0">
          <div className="font-semibold">Folder</div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="aspect-[35/12] sm:aspect-[22/6] md:aspect-[18/5] bg-muted/50 hover:bg-muted/100 rounded-md sm:rounded-lg lg:rounded-xl transition-all duration-300 cursor-pointer p-4 flex flex-col gap-4"
              >
                <div className="h-full flex items-center justify-between text-center">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FaFolder size={20} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground truncate block flex-1 pl-1">
                      Ayushdddddddddddddddddddddddd
                    </span>
                  </div>
                  <FileDropdown />
                </div>
              </div>
            ))}
          </div>
          <div className="font-semibold">Files</div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-md sm:rounded-lg lg:rounded-xl bg-muted/50 hover:bg-muted/100 transition-all duration-300 cursor-pointer p-2 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2 p-1">
                  <div className="flex items-center gap-2 h-full text-center flex-1 min-w-0">
                    <Icon
                      style={{ color }}
                      className="text-md sm:text-base md:text-lg"
                    />

                    <span className="text-sm font-medium text-muted-foreground truncate block flex-1">
                      Ayusddddddddddddddddddh.jpeg
                    </span>
                    <FileDropdown />
                  </div>
                </div>

                <div className="relative flex-1 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                  {dummyFile.thumbnailLink ? (
                    <Image
                      src={dummyFile1.thumbnailLink}
                      alt="thumbnail"
                      width={230}
                      height={230}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      No Preview
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
