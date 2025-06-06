"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

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
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { clientAuth } from "@/lib/firebase/firebase-client";

export function NavUser({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) {
  const { isMobile } = useSidebar();

  const router = useRouter();
  const [user, userLoading, userError] = useAuthState(clientAuth);
  const [signOut, signOutLoading, signOutError] = useSignOut(clientAuth);

  const handleSignOut = async () => {
    try {
      const success = await signOut(); // Your Firebase sign-out function

      // if (success) {
      //   const response = await fetch("/api/auth/logout", { method: "POST" });

      //   if (response.ok) {
      //     router.push("/auth/sign-in");
      //   } else {
      //     console.error("Failed to clear session cookie on backend");
      //   }
      // } else {
      //   console.error("Firebase sign-out failed");
      // }

      if (success) {
        await axios.post("api/auth/logout");
        router.push("/auth/sign-in");
      } else {
        console.error("Firebase sign-out failed");
      }
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  function getInitials(name: string): string {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user.photoURL ?? ""}
                  alt={user.displayName ?? "User"}
                />
                <AvatarFallback className="rounded-lg">
                  {getInitials(user.displayName ?? "User")}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.displayName
                    ? user.displayName.split(" ")[0].charAt(0).toUpperCase() +
                      user.displayName.split(" ")[0].slice(1)
                    : "User"}
                </span>

                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.photoURL ?? ""}
                    alt={user.displayName ?? "User"}
                  />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user.displayName ?? "User")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.displayName
                      ? user.displayName.split(" ")[0].charAt(0).toUpperCase() +
                        user.displayName.split(" ")[0].slice(1)
                      : "User"}
                  </span>

                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  setActiveTab("Profile");
                }}
              >
                <BadgeCheck />
                Profile
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem> */}
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
