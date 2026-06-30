"use client";

import type React from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type TableWorkbenchProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  filters?: React.ReactNode;
  filterPanelClassName?: string;
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    size?: "sm" | "default" | "lg";
    widthClassName?: string;
  };
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

// Internal layout primitive.
// Page-level modules should prefer DataTableWorkbench or ExpandableDataTable so
// filter/header/pagination structure stays on a single business contract.
function TableWorkbench({
  title,
  subtitle,
  filters,
  filterPanelClassName,
  search,
  actions,
  children,
  className,
}: TableWorkbenchProps) {
  const searchSize = search?.size ?? "default";

  return (
    <div className={cn("flex min-w-0 flex-1 flex-col gap-5", className)}>
      {filters ? (
        <div
          data-slot="table-workbench-filter-panel"
          className={cn("flex min-w-0 flex-col gap-4", filterPanelClassName)}
        >
          {filters}
          <div className="h-px w-full bg-border" />
        </div>
      ) : null}

      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-baseline gap-3">
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            {subtitle ? <span className="text-sm text-muted-foreground">{subtitle}</span> : null}
          </div>

          {(search || actions) ? (
            <div className="flex flex-wrap items-center gap-4">
              {search ? (
                <div className={cn("relative w-60", search.widthClassName)}>
                  <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    size={searchSize}
                    value={search.value}
                    onChange={(event) => search.onChange(event.target.value)}
                    placeholder={search.placeholder ?? "Search"}
                    className="pl-8 text-sm"
                  />
                </div>
              ) : null}
              {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
            </div>
          ) : null}
        </div>

        {children}
      </div>
    </div>
  );
}

export { TableWorkbench };
