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
      const avgItemWidth = 120;
      const padding = 60;
      const visibleCount = Math.floor((width - padding) / avgItemWidth);

      // Ensure at least 3 items are always visible: first, last, and one more
      setMaxVisibleItems(Math.max(3, Math.min(items.length, visibleCount)));
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [items.length]);

  const isCollapsible = items.length > maxVisibleItems;
  const firstItem = items[0];

  const numTailItems = isCollapsible ? maxVisibleItems - 2 : items.length - 1;
  const tailItems = items.slice(items.length - numTailItems);
  const collapsedItems = isCollapsible
    ? items.slice(1, items.length - numTailItems)
    : [];

  return (
    <div ref={containerRef}>
      <Breadcrumb className={className}>
        <BreadcrumbList className="text-2xl whitespace-nowrap overflow-hidden text-ellipsis">
          {/* First Item */}
          <span className="flex items-center min-w-0 max-w-[200px]">
            <BreadcrumbItem className="min-w-0 max-w-[80px] lg:max-w-[300px]">
              <BreadcrumbLink
                href="#"
                onClick={() => handleClick(firstItem)}
                className="text-2xl truncate block"
                title={firstItem.label}
              >
                {firstItem.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {items.length > 1 && <BreadcrumbSeparator />}
          </span>

          {/* Collapsed Dropdown */}
          {isCollapsible && collapsedItems.length > 0 && (
            <span className="flex items-center min-w-0 max-w-[200px]">
              <BreadcrumbItem className="min-w-0 max-w-[200px]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <BreadcrumbEllipsis className="cursor-pointer text-2xl" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {collapsedItems.map((crumb, idx) => (
                      <DropdownMenuItem
                        key={crumb.id ?? idx}
                        onClick={() => handleClick(crumb)}
                        className="truncate max-w-[200px]"
                        title={crumb.label}
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

          {/* Tail Items */}
          {tailItems.map((crumb, index) => {
            const isLast = index === tailItems.length - 1;
            return (
              <span
                key={crumb.id ?? index}
                className="flex items-center min-w-0 max-w-[200px]"
              >
                <BreadcrumbItem className="min-w-0 max-w-[200px]">
                  {isLast ? (
                    <BreadcrumbPage
                      className="text-2xl truncate block"
                      title={crumb.label}
                    >
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href="#"
                      onClick={() => handleClick(crumb)}
                      className="text-2xl truncate block"
                      title={crumb.label}
                    >
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </span>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
