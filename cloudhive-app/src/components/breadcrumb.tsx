"use client";

import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
  const [expanded, setExpanded] = useState(false);
  const lastIndex = items.length - 1;

  const handleClick = (crumb: Crumb) => {
    if (crumb.id && onCrumbClick) {
      onCrumbClick(crumb.id, crumb.email ?? null);
    }
  };

  const isCollapsible = items.length > 5;
  const visibleItems =
    expanded || !isCollapsible ? items : [items[0], ...items.slice(-4)];

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="text-2xl">
        {visibleItems.map((crumb, index) => {
          const isLast = index === visibleItems.length - 1;
          const realIndex =
            expanded || !isCollapsible ? index : items.indexOf(crumb);

          return (
            <span key={crumb.id ?? index} className="flex items-center">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-2xl">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href="#"
                    className="text-2xl"
                    onClick={() => handleClick(crumb)}
                  >
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {realIndex < lastIndex && <BreadcrumbSeparator />}
              {isCollapsible && !expanded && realIndex === 0 && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbEllipsis
                      className="cursor-pointer text-2xl"
                      onClick={() => setExpanded(true)}
                    />
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
