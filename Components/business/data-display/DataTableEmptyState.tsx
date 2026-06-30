"use client";

import * as React from "react";

import { Empty } from "@/components/ui/empty";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type DataTableEmptyStateProps = {
  variant?: DataTableEmptyStateVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
};

type DataTableEmptyStateVariant = "no-data" | "no-results";

type DataTableEmptyStateResolution = {
  hasSourceRows: boolean;
  search?: string;
  hasActiveFilters?: boolean;
};

type DataTableEmptyStateRowProps = DataTableEmptyStateProps & {
  colSpan: number;
  rowClassName?: string;
  cellClassName?: string;
};

const DATA_TABLE_EMPTY_COPY: Record<
  DataTableEmptyStateVariant,
  { title: string; description?: string }
> = {
  "no-data": {
    title: "No Data",
  },
  "no-results": {
    title: "No Results",
    description: "Try adjusting filters, search terms, or view settings to broaden the result set.",
  },
};

function DataTableEmptyIllustration() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 96 96"
      className="h-24 w-24"
      fill="none"
    >
      <path d="M21 42h18l8-8v8h28l10 10v19c0 2.8-2.2 5-5 5H16c-2.8 0-5-2.2-5-5V52l10-10Z" fill="#E5E6EB" />
      <path d="M47 42h28l7 7H14l7-7h18l8-8v8Z" fill="#C9CDD4" />
      <path d="M38 18c0-1.1.9-2 2-2h20l10 10v28c0 1.1-.9 2-2 2H40c-1.1 0-2-.9-2-2V18Z" fill="#F7F8FA" />
      <path d="M60 16v8c0 1.1.9 2 2 2h8L60 16Z" fill="#E5E6EB" />
      <rect x="45" y="27" width="18" height="4" rx="2" fill="#E5E6EB" />
      <rect x="45" y="35" width="18" height="3" rx="1.5" fill="#C9CDD4" />
      <rect x="45" y="41" width="14" height="3" rx="1.5" fill="#E5E6EB" />
      <rect x="42" y="61" width="12" height="3" rx="1.5" fill="#F7F8FA" />
      <rect x="39" y="66" width="18" height="3" rx="1.5" fill="#F7F8FA" />
    </svg>
  );
}

function DataTableNoResultsIllustration() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 96 96"
      className="h-24 w-24"
      fill="none"
    >
      <path d="M24 27c0-1.1.9-2 2-2h16l8 8v29c0 1.1-.9 2-2 2H26c-1.1 0-2-.9-2-2V27Z" fill="#F7F8FA" />
      <path d="M42 25v6c0 1.1.9 2 2 2h6L42 25Z" fill="#E5E6EB" />
      <rect x="30" y="38" width="14" height="3" rx="1.5" fill="#E5E6EB" />
      <rect x="30" y="44" width="14" height="3" rx="1.5" fill="#E5E6EB" />
      <rect x="30" y="50" width="10" height="3" rx="1.5" fill="#E5E6EB" />
      <path d="M43 31c0-1.1.9-2 2-2h16l8 8v29c0 1.1-.9 2-2 2H45c-1.1 0-2-.9-2-2V31Z" fill="#F2F3F5" />
      <path d="M61 29v6c0 1.1.9 2 2 2h6L61 29Z" fill="#E5E6EB" />
      <rect x="49" y="42" width="14" height="3" rx="1.5" fill="#E5E6EB" />
      <rect x="49" y="48" width="14" height="3" rx="1.5" fill="#E5E6EB" />
      <rect x="49" y="54" width="10" height="3" rx="1.5" fill="#E5E6EB" />
      <circle cx="56" cy="56" r="13" fill="#F7F8FA" stroke="#C9CDD4" strokeWidth="4" />
      <path
        d="M53 52.6a3.7 3.7 0 1 1 6.3 2.6c-1.3 1.2-1.9 1.8-1.9 3.3"
        stroke="#C9CDD4"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="57" cy="64.4" r="1.7" fill="#C9CDD4" />
      <path d="m65.8 66.8 7.4 7.4" stroke="#C9CDD4" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function getDataTableEmptyStateVariant({
  hasSourceRows,
  search,
  hasActiveFilters = false,
}: DataTableEmptyStateResolution): DataTableEmptyStateVariant {
  if (!hasSourceRows) return "no-data";
  if (Boolean(search?.trim()) || hasActiveFilters) return "no-results";
  return "no-data";
}

export function getDataTableEmptyStateCopy(
  variant: DataTableEmptyStateVariant,
  overrides?: Partial<Record<DataTableEmptyStateVariant, Partial<{ title: React.ReactNode; description?: React.ReactNode }>>>,
) {
  const copy = DATA_TABLE_EMPTY_COPY[variant];
  return {
    title: overrides?.[variant]?.title ?? copy.title,
    description: overrides?.[variant]?.description ?? copy.description,
  };
}

export function DataTableEmptyState({
  variant = "no-data",
  title = "No Data",
  description,
  className,
}: DataTableEmptyStateProps) {
  return (
    <Empty
      icon={
        variant === "no-results" ? (
          <DataTableNoResultsIllustration />
        ) : (
          <DataTableEmptyIllustration />
        )
      }
      title={title}
      description={description}
      className={cn(
        "min-h-[160px] w-full gap-2 px-6 py-10",
        className,
      )}
      iconContainerClassName="h-24 w-24 rounded-none bg-transparent p-0 text-inherit"
    />
  );
}

export function DataTableEmptyStateRow({
  colSpan,
  variant,
  title,
  description,
  className,
  rowClassName,
  cellClassName,
}: DataTableEmptyStateRowProps) {
  return (
    <TableRow className={rowClassName}>
      <TableCell colSpan={colSpan} className={cn("px-0 py-0", cellClassName)}>
        <DataTableEmptyState
          variant={variant}
          title={title}
          description={description}
          className={className}
        />
      </TableCell>
    </TableRow>
  );
}

export type { DataTableEmptyStateProps, DataTableEmptyStateRowProps };
