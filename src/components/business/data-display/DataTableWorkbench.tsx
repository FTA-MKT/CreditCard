"use client";

import type React from "react";

import {
  DataTableFooter,
  type DataTableFooterGoTo,
  type DataTableFooterPageSize,
  type DataTablePageItem,
} from "@/components/business/data-display/DataTableFooter";
import { TableWorkbench, type TableWorkbenchProps } from "@/components/business/data-display/TableWorkbench";
import { TableSurface } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type DataTableWorkbenchBaseProps = Omit<TableWorkbenchProps, "children"> & {
  children: React.ReactNode;
  surfaceClassName?: string;
  // "embedded" drops TableSurface's border/background/shadow — use it when the
  // children are already visually self-contained (e.g. a grid of bordered
  // cards), so the page doesn't end up with a card-inside-a-card box. Leave as
  // "default" for real tabular content, where the surface border is the
  // table's own frame.
  surfaceVariant?: "default" | "embedded";
  footerClassName?: string;
};

type DataTableWorkbenchWithoutFooterProps = DataTableWorkbenchBaseProps & {
  footer?: false;
};

type DataTableWorkbenchWithDefaultFooterProps = DataTableWorkbenchBaseProps & {
  footer?: React.ReactNode;
  totalLabel: React.ReactNode;
  currentPage: number;
  totalPages: number;
  pageItems?: DataTablePageItem[];
  onPageChange: (page: number) => void;
  pageSize?: DataTableFooterPageSize;
  goTo?: DataTableFooterGoTo;
};

export type DataTableWorkbenchProps =
  | DataTableWorkbenchWithoutFooterProps
  | DataTableWorkbenchWithDefaultFooterProps;

function hasDefaultFooter(
  props: DataTableWorkbenchProps,
): props is DataTableWorkbenchWithDefaultFooterProps {
  return props.footer !== false;
}

export function DataTableFilters({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="data-table-filters"
      className={cn("flex flex-wrap items-end gap-4", className)}
      {...props}
    />
  );
}

// Width variants:
//   "default" — single input / select / multi-select (max 15rem / 240px)
//   "wide"    — date range picker or numeric range with two inputs (max 18rem / 288px)
export function DataTableFilterField({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "wide";
}) {
  return (
    <div
      data-slot="data-table-filter-field"
      className={cn(
        "flex w-full min-w-0 flex-col gap-1 justify-self-start",
        size === "default" && "max-w-[15rem]",
        size === "wide" && "max-w-[18rem]",
        className,
      )}
      {...props}
    />
  );
}

// Standardised label for filter fields — matches the Program page reference:
// 12px / 500 weight / var(--fta-text-4). Kept as inline style rather than a
// Tailwind utility so it stays byte-identical to the reference across themes.
export function DataTableFilterLabel({
  className,
  style,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="data-table-filter-label"
      className={className}
      style={{ fontSize: 12, fontWeight: 500, color: "var(--fta-text-4)", ...style }}
      {...props}
    />
  );
}

export function getDataTablePageItems(currentPage: number, totalPages: number): DataTablePageItem[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  if (currentPage <= 4) return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  if (currentPage >= totalPages - 3) {
    return [1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}

export function DataTableWorkbench(props: DataTableWorkbenchProps) {
  const {
    children,
    title,
    subtitle,
    filters,
    filterPanelClassName,
    search,
    actions,
    className,
    surfaceClassName,
    surfaceVariant,
    footerClassName,
    footer,
  } = props;
  const shouldRenderDefaultFooter = hasDefaultFooter(props);
  const currentPage = shouldRenderDefaultFooter ? props.currentPage : 1;
  const totalPages = shouldRenderDefaultFooter ? props.totalPages : 1;
  const pageItems =
    shouldRenderDefaultFooter ? props.pageItems ?? getDataTablePageItems(currentPage, totalPages) : [];
  let footerContent: React.ReactNode = null;

  if (footer !== false && footer != null) {
    footerContent = footer;
  } else if (shouldRenderDefaultFooter) {
    footerContent = (
      <DataTableFooter
        totalLabel={props.totalLabel}
        currentPage={currentPage}
        totalPages={totalPages}
        pageItems={pageItems}
        onPageChange={props.onPageChange}
        pageSize={props.pageSize}
        goTo={props.goTo}
        className={footerClassName}
      />
    );
  }

  return (
    <TableWorkbench
      title={title}
      subtitle={subtitle}
      filters={filters}
      filterPanelClassName={filterPanelClassName}
      search={search}
      actions={actions}
      className={className}
    >
      <TableSurface className={surfaceClassName} variant={surfaceVariant}>
        {children}
        {footerContent}
      </TableSurface>
    </TableWorkbench>
  );
}

// Page-level default shell:
// prefer this for standard filter/header/search/action/table layouts, even when
// the current screen omits the default footer via `footer={false}`.
