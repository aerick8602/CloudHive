import * as React from "react";
import { LifeBuoy, Send, type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navSecondary = [
  {
    title: "Support",

    icon: LifeBuoy,
  },
  {
    title: "Feedback",

    icon: Send,
  },
];
export function NavSecondary({
  ...props
}: {} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup className="!p-0">
      <SidebarGroupContent>
        <SidebarMenu>
          {navSecondary.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild size="sm">
                <a>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
