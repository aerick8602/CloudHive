"use client";

import {
  ChevronRight,
  Clapperboard,
  Images,
  Video,
  AudioLines,
  FileTerminal,
  FileText,
  Package,
  Settings2,
  User,
  AtSign,
  type LucideIcon,
} from "lucide-react";

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavProjects({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) {
  const items = [
    {
      title: "Media",
      url: "#",
      icon: Clapperboard,
      isActive: false,
      items: [
        { title: "Images", icon: Images, url: "#" },
        { title: "Videos", icon: Video, url: "#" },
        { title: "Audio", icon: AudioLines, url: "#" },
        { title: "Documents", icon: FileTerminal, url: "#" },
        { title: "Text", icon: FileText, url: "#" },
        { title: "Archives", icon: Package, url: "#" },
      ],
    },
    {
      title: "Setting",
      url: "#",
      icon: Settings2,
      isActive: false,
      items: [
        { title: "Profile", icon: User, url: "#" },
        { title: "Accounts", icon: AtSign, url: "#" },
      ],
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Explorer</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          item.items?.length ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          onClick={() => {
                            setActiveTab(subItem.title);
                            console.log("Clicked sub-item:", subItem.title);
                          }}
                        >
                          {subItem.icon && <subItem.icon className="w-4 h-4" />}
                          <span>{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                onClick={() => {
                  setActiveTab(item.title);
                  console.log("Clicked item:", item.title);
                }}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
