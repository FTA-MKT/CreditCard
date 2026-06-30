"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DataTableFilterActionsProps = {
  onReset?: () => void;
  onSearch?: () => void;
  resetLabel?: React.ReactNode;
  searchLabel?: React.ReactNode;
  className?: string;
};

export function DataTableFilterActions({
  onReset,
  onSearch,
  resetLabel = "Reset",
  searchLabel = "Search",
  className,
}: DataTableFilterActionsProps) {
  return (
    <div className={cn("flex w-full items-center justify-end gap-2 md:ml-auto md:w-auto", className)}>
      <Button
        variant="ghost"
        size="default"
        onClick={onReset}
      >
        {resetLabel}
      </Button>
      <Button
        variant="secondary"
        size="default"
        onClick={onSearch}
      >
        {searchLabel}
      </Button>
    </div>
  );
}
