"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type RecentEntityListTone = "primary" | "warning";

export type RecentEntityListItem = {
  id: string | number;
  title: React.ReactNode;
  badge: React.ReactNode;
  trailing?: React.ReactNode;
};

export type PanelRecentEntityListProps = {
  title: React.ReactNode;
  items: readonly RecentEntityListItem[];
  className?: string;
  itemClassName?: string;
};

export function PanelRecentEntityList({
  title,
  items,
  className,
  itemClassName,
}: PanelRecentEntityListProps) {
  const renderItemTitle = (value: React.ReactNode) => {
    if (typeof value === "string" || typeof value === "number") {
      return (
        <Button variant="link" size="sm" className="h-auto px-0 font-normal text-primary">
          {value}
        </Button>
      );
    }

    return value;
  };

  return (
    <div
      className={cn(
        "flex w-full min-w-[14rem] max-w-[24rem] basis-[clamp(14rem,22vw,24rem)] shrink flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground",
        className,
      )}
      style={{
        borderWidth: "var(--surface-border-width)",
        borderColor: "var(--surface-border-color)",
        boxShadow: "var(--surface-shadow)",
      }}
    >
      <h3 className="border-b border-border pb-3 text-base font-semibold text-foreground">{title}</h3>
      <div className="flex flex-col divide-y divide-border">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn("flex items-center justify-between py-3 first:pt-0 last:pb-0", itemClassName)}
          >
            <div className="flex min-w-0 items-center gap-1.5">
              {item.badge}
              <div className="min-w-0 truncate text-sm">{renderItemTitle(item.title)}</div>
            </div>
            {item.trailing ? <div className="shrink-0">{item.trailing}</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
