"use client";

import { HardDrive, ClockFading, Star, Trash2, Cloudy } from "lucide-react";
import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) {
  const items = [
    {
      title: "Drive",

      icon: HardDrive,
    },
    {
      title: "Recent",

      icon: ClockFading,
    },
    {
      title: "Starred",

      icon: Star,
    },
    {
      title: "Trash",

      icon: Trash2,
    },
    {
      title: "Storage",

      icon: Cloudy,
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>My Clouds</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => {
                    setActiveTab(item.title);
                    console.log("Clicked:", item.title);
                  }}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent />
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
