"use client";

import type React from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

type DataTableFilterActionsProps = {
  onReset?: () => void;
  onSearch?: () => void;
  resetLabel?: React.ReactNode;
  searchLabel?: React.ReactNode;
  className?: string;
};

// Matches the Program page reference exactly: Reset as .btn-ghost.btn-sm,
// Search as .btn-primary.btn-sm with a leading icon. Native .btn classes are
// used instead of the shadcn Button so every page sharing this component
// renders pixel-identical to the reference rather than the ghost/secondary
// shadcn variants, which read as a lighter, un-primary "Search" action.
export function DataTableFilterActions({
  onReset,
  onSearch,
  resetLabel = "Reset",
  searchLabel = "Search",
  className,
}: DataTableFilterActionsProps) {
  return (
    <div className={cn("flex w-full items-center justify-end gap-2 md:ml-auto md:w-auto", className)}>
      <button type="button" className="btn btn-ghost btn-sm" onClick={onReset}>
        {resetLabel}
      </button>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        style={{ display: "flex", alignItems: "center", gap: 6 }}
        onClick={onSearch}
      >
        <Search size={13} />
        {searchLabel}
      </button>
    </div>
  );
}
