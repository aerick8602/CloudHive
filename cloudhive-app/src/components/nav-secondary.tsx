import * as React from "react";
import { LifeBuoy, Send, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { clientAuth } from "@/lib/firebase/firebase-client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SupportDialog } from "@/components/dialog/support-dialog";
import { FeedbackDialog } from "@/components/dialog/feedback-dialog";

const navSecondary = [
  {
    title: "Support",
    icon: LifeBuoy,
    dialog: "support",
  },
  {
    title: "Feedback",
    icon: Send,
    dialog: "feedback",
  },
];

export function NavSecondary({
  ...props
}: {} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const [openDialog, setOpenDialog] = useState<"support" | "feedback" | null>(null);
  const [user] = useAuthState(clientAuth);

  const handleClick = (dialog: string) => {
    setOpenDialog(dialog as "support" | "feedback");
  };

  return (
    <>
      <SidebarGroup className="!p-0">
        <SidebarGroupContent>
          <SidebarMenu className="gap-0">
            {navSecondary.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  tooltip={item.title} 
                  size="sm"
                  onClick={() => handleClick(item.dialog)}
                >
                  <div className="text-xs flex h-full items-center">
                    <item.icon className="w-4 h-4 mr-2" />
                    <span>{item.title}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SupportDialog 
        open={openDialog === "support"} 
        onOpenChange={(open) => setOpenDialog(open ? "support" : null)} 
      />
      <FeedbackDialog 
        open={openDialog === "feedback"} 
        onOpenChange={(open) => setOpenDialog(open ? "feedback" : null)}
        userEmail={user?.email || undefined}
      />
    </>
  );
}
