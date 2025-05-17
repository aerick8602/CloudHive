"use client";

import { useEffect, useRef, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export interface Crumb {
  label: string;
  id?: string;
  email?: string | null;
}

interface AppBreadcrumbProps {
  items: Crumb[];
  onCrumbClick?: (id: string, email: string | null) => void;
  className?: string;
}

export function AppBreadcrumb({
  items,
  onCrumbClick,
  className,
}: AppBreadcrumbProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxVisibleItems, setMaxVisibleItems] = useState(items.length);

  const handleClick = (crumb: Crumb) => {
    if (crumb.id && onCrumbClick) {
      onCrumbClick(crumb.id, crumb.email ?? null);
    }
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      // Responsive: smaller avgItemWidth for mobile, larger for desktop
      const isMobile = window.innerWidth < 640; // Tailwind's sm breakpoint
      const avgItemWidth = isMobile ? 80 : 120;
      const padding = isMobile ? 10 : 60;
      const minVisible = isMobile ? 1 : 3;
      const visibleCount = Math.floor((width - padding) / avgItemWidth);

      setMaxVisibleItems(
        Math.max(minVisible, Math.min(items.length, visibleCount))
      );
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [items.length]);

  const isCollapsible = items.length > 3;
  const firstItem = items[0];
  const lastItem = items[items.length - 1];
  const hasMiddle = items.length > 2;
  const middleItem = hasMiddle ? items[1] : null;
  const collapsedItems = isCollapsible ? items.slice(1, items.length - 1) : [];

  return (
    <div ref={containerRef}>
      <Breadcrumb className={className}>
        <BreadcrumbList className="text-2xl whitespace-nowrap overflow-hidden text-ellipsis">
          {/* First Item */}
          <span className="flex items-center">
            <BreadcrumbItem>
              <BreadcrumbLink
                href="#"
                onClick={() => handleClick(firstItem)}
                className="text-2xl"
              >
                {firstItem.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {items.length > 1 && <BreadcrumbSeparator />}
          </span>

          {/* Collapsed Dropdown for middle items if more than 3 */}
          {isCollapsible && collapsedItems.length > 0 && (
            <span className="flex items-center">
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <BreadcrumbEllipsis className="cursor-pointer text-2xl" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {collapsedItems.map((crumb, idx) => (
                      <DropdownMenuItem
                        key={crumb.id ?? idx}
                        onClick={() => handleClick(crumb)}
                        className="max-w-[90px] sm:max-w-[180px] truncate"
                      >
                        {crumb.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </span>
          )}

          {/* Middle Item (only if exactly 3 items) */}
          {!isCollapsible && hasMiddle && middleItem && (
            <span className="flex items-center">
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="#"
                  onClick={() => handleClick(middleItem)}
                  className="text-2xl max-w-[70px] sm:max-w-[120px] truncate"
                >
                  {middleItem.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </span>
          )}

          {/* Last Item */}
          {items.length > 1 && (
            <span className="flex items-center">
              <BreadcrumbItem>
                <BreadcrumbPage className="text-2xl max-w-[70px] sm:max-w-[120px] truncate">
                  {lastItem.label}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </span>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
