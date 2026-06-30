"use client";

import type React from "react";

import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPageSize,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TableFooterBar } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type DataTablePageItem = number | "ellipsis";

export type DataTableFooterPageSize = {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<string | number>;
};

export type DataTableFooterGoTo = {
  value: string;
  onValueChange: (value: string) => void;
  onCommit: () => void;
  ariaLabel?: string;
};

function stopLink(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

export function DataTableFooter({
  totalLabel,
  currentPage,
  totalPages,
  pageItems,
  onPageChange,
  pageSize,
  goTo,
  className,
}: {
  totalLabel: React.ReactNode;
  currentPage: number;
  totalPages: number;
  pageItems: DataTablePageItem[];
  onPageChange: (page: number) => void;
  pageSize?: DataTableFooterPageSize;
  goTo?: DataTableFooterGoTo;
  className?: string;
}) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <TableFooterBar className={className}>
      <span className="text-xs text-muted-foreground">{totalLabel}</span>
      <Pagination size="sm" className="mx-0 w-auto flex-none justify-end">
        <PaginationContent size="sm">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              size="sm"
              aria-disabled={!canGoPrevious}
              className={!canGoPrevious ? "pointer-events-none opacity-50" : undefined}
              onClick={(event) => {
                stopLink(event);
                if (canGoPrevious) onPageChange(currentPage - 1);
              }}
            />
          </PaginationItem>
          {pageItems.map((page, index) =>
            page === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis size="sm" />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  size="sm"
                  isActive={page === currentPage}
                  onClick={(event) => {
                    stopLink(event);
                    onPageChange(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              size="sm"
              aria-disabled={!canGoNext}
              className={!canGoNext ? "pointer-events-none opacity-50" : undefined}
              onClick={(event) => {
                stopLink(event);
                if (canGoNext) onPageChange(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {pageSize ? (
        <PaginationPageSize
          size="sm"
          value={pageSize.value}
          onValueChange={pageSize.onValueChange}
          options={pageSize.options}
        />
      ) : null}
      {goTo ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Go to</span>
          <Input
            size="sm"
            value={goTo.value}
            onChange={(event) => goTo.onValueChange(event.target.value.replace(/[^\d]/g, ""))}
            onBlur={goTo.onCommit}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                goTo.onCommit();
              }
            }}
            className={cn("h-8 w-11 px-2 text-center")}
            inputMode="numeric"
            aria-label={goTo.ariaLabel ?? "Go to page"}
          />
        </div>
      ) : null}
    </TableFooterBar>
  );
}
