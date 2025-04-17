"use client";

import { useEffect, useState } from "react";
import { ChevronsUpDown, LucideIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar } from "@/components/ui/avatar";

// Define level-to-color mapping
const levelColors: Record<string, string> = {
  INFO: "text-blue-500",
  ERROR: "text-red-500",
  WARNING: "text-yellow-500",
  DEBUG: "text-green-500",
  TRACE: "text-cyan-500",
  FATAL: "text-pink-500",
};

export function NavLog({
  log,
}: {
  log: {
    title: string;
    info: string;
    icon: LucideIcon;
  };
}) {
  const [logs, setLogs] = useState<
    { timestamp: string; level: string; message: string }[]
  >([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/logs");
        const data = await res.json();
        setLogs(data);
      } catch (error) {
        console.error("Failed to fetch logs", error);
      }
    };
    fetchLogs();
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={log.title}
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-lg flex items-center justify-center">
                <log.icon />
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{log.title}</span>
                <span className="truncate text-xs">{log.info}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="overflow-y-auto !rounded-t-r-xl"
        style={{ borderTopRightRadius: "15px", borderTopLeftRadius: "15px" }}
      >
        <SheetHeader>
          <SheetTitle>
            <p>PS C:\CloudHive&gt; debug-console-logs@latest --all</p>
          </SheetTitle>
          <SheetDescription className="max-h-[40vh] overflow-y-auto text-sm font-mono">
            {logs.length === 0 ? (
              <p className="text-muted-foreground">Loading logs...</p>
            ) : (
              logs.slice().map((log, idx) => {
                return (
                  <div
                    key={idx}
                    className="flex flex-col whitespace-pre-wrap break-words "
                  >
                    <div className="sm:hidden text-sm pl-1">{log.message}</div>

                    {/* Desktop layout */}
                    <div className="hidden sm:flex gap-2 items-start w-full">
                      <span className="w-[130px]  text-sm">
                        {log.timestamp}
                      </span>
                      <span>|</span>
                      <span
                        className={`w-[60px] font-semibold text-xs ${
                          levelColors[log.level.toUpperCase()] || ""
                        }`}
                      >
                        {log.level}
                      </span>
                      <span>|</span>
                      <span className="flex-1 break-words">{log.message}</span>
                    </div>
                  </div>
                );
              })
            )}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
