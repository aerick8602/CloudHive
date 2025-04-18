"use client";

import { useEffect, useState } from "react";
import { ChevronsUpDown, CodeXmlIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/magicui/terminal";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar } from "@/components/ui/avatar";

export function NavLog() {
  const [logs, setLogs] = useState<
    { timestamp: string; level: string; message: string }[]
  >([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/logs");
        const data = await res.json();

        setLogs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch logs", error);
        setLogs([]);
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
              tooltip="Console"
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-lg flex items-center justify-center">
                <CodeXmlIcon />
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Dev Console</span>
                <span className="truncate text-xs">fastapi-server-logs</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="overflow-y-auto !rounded-t-r-xl !w-screen"
        style={{ borderTopRightRadius: "15px", borderTopLeftRadius: "15px" }}
      >
        <Terminal className="!w-screen">
          {logs.length === 0 ? (
            <TypingAnimation className="text-muted-foreground">
              Loading logs...
            </TypingAnimation>
          ) : (
            logs.map((log, idx) => {
              let icon = "";
              let color = "";
              switch (log.level.toUpperCase()) {
                case "DEBUG":
                  icon = "✔";
                  color = "text-green-500";
                  break;
                case "INFO":
                  icon = "•";
                  color = "text-blue-500";
                  break;
                case "ERROR":
                  icon = "✘";
                  color = "text-red-500";
                  break;
                case "WARNING":
                  icon = "⚠";
                  color = "text-yellow-500";
                  break;
                case "CRITICAL":
                  icon = "☢";
                  color = "text-black-800";
                  break;
                default:
                  icon = "🛠";
                  color = "text-muted-foreground";
              }

              return (
                <AnimatedSpan
                  key={idx}
                  delay={500 + idx * 100}
                  className={color}
                >
                  <span className="break-words whitespace-pre-wrap ">
                    {icon} {log.message}
                  </span>
                </AnimatedSpan>
              );
            })
          )}
        </Terminal>
      </SheetContent>
    </Sheet>
  );
}
