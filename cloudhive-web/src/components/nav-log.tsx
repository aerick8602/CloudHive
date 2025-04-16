"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  LucideIcon,
  Sparkles,
} from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { title } from "process";

export function NavLog({
  log,
}: {
  log: {
    title: string;
    info: string;
    icon: LucideIcon;
  };
}) {
  const { isMobile } = useSidebar();

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
        className=" overflow-y-auto !rounded-t-r-xl"
        style={{ borderTopRightRadius: "15px", borderTopLeftRadius: "15px" }}
      >
        <SheetHeader>
          <SheetTitle>
            <p>PS C:\CloudHive&gt; debug-console-logs@latest --all</p>
          </SheetTitle>
          <SheetDescription className="max-h-[40vh] overflow-y-auto ">
            <p>
              Make changes to your profile here. Click save when you're done.
            </p>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
