"use client";

import type React from "react";
import { ChevronsUpDown, Minus, Plus } from "lucide-react";

import {
  DataTableFooter,
  type DataTableFooterGoTo,
  type DataTableFooterPageSize,
  type DataTablePageItem,
} from "@/components/business/data-display/DataTableFooter";
import { TableWorkbench, type TableWorkbenchProps } from "@/components/business/data-display/TableWorkbench";
import { getDataTablePageItems } from "@/components/business/data-display/DataTableWorkbench";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableSurface,
  type TableProps,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type ExpandableDataTableProps = {
  header: React.ReactNode;
  children: React.ReactNode;
  totalLabel: React.ReactNode;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageItems?: DataTablePageItem[];
  pageSize?: DataTableFooterPageSize;
  goTo?: DataTableFooterGoTo;
  bodyClassName?: string;
  bodyShowRowBorders?: boolean;
  footerClassName?: string;
  surfaceClassName?: string;
  tableClassName?: string;
  tableProps?: Omit<TableProps, "children" | "className">;
  footer?: false;
} & Partial<Omit<TableWorkbenchProps, "children">>;

// Standard expandable-row page shell.
// When a page needs the usual workbench chrome plus expandable rows, prefer this
// contract instead of wrapping ExpandableDataTable with TableWorkbench in a module.

export function ExpandableRowToggleHead({
  className,
  columnId = "expander",
  ...props
}: React.ComponentProps<"th"> & { columnId?: string }) {
  return (
    <TableHead
      columnId={columnId}
      minWidth={56}
      resizable={false}
      className={cn("w-14 min-w-14 px-0 text-center", className)}
      {...props}
    />
  );
}

export function ExpandableRowToggleCell({
  className,
  children,
  ...props
}: React.ComponentProps<"td">) {
  return (
    <TableCell className={cn("w-14 min-w-14 px-0 text-center", className)} {...props}>
      <div className="flex items-center justify-center">{children}</div>
    </TableCell>
  );
}

export function ExpandableRowToggleButton({
  expanded,
  onClick,
  ariaLabel,
  className,
}: {
  expanded: boolean;
  onClick: () => void;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        "size-6 rounded-[4px] border border-primary/30 bg-background p-0 text-primary shadow-none hover:border-primary/45 hover:bg-primary/5 hover:text-primary",
        className,
      )}
    >
      {expanded ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
    </Button>
  );
}

export function ExpandableDataTableToggleAllButton({
  expanded,
  onClick,
  expandLabel = "Expand",
  collapseLabel = "Collapse",
  ariaLabel,
  className,
}: {
  expanded: boolean;
  onClick: () => void;
  expandLabel?: string;
  collapseLabel?: string;
  ariaLabel?: string;
  className?: string;
}) {
  const label = expanded ? collapseLabel : expandLabel;

  return (
    <Button
      type="button"
      variant="outline"
      className={cn("gap-2", className)}
      aria-label={ariaLabel ?? label}
      onClick={onClick}
    >
      <ChevronsUpDown className="size-4" />
      {label}
    </Button>
  );
}

export function ExpandableDataTable({
  header,
  children,
  totalLabel,
  currentPage,
  totalPages,
  onPageChange,
  pageItems = getDataTablePageItems(currentPage, totalPages),
  pageSize,
  goTo,
  bodyClassName,
  bodyShowRowBorders = true,
  footerClassName,
  surfaceClassName,
  tableClassName,
  tableProps,
  footer,
  title,
  subtitle,
  filters,
  filterPanelClassName,
  search,
  actions,
  className,
}: ExpandableDataTableProps) {
  const shouldUseWorkbench = Boolean(title || subtitle || filters || search || actions);

  const tableContent = (
    <TableSurface className={surfaceClassName}>
      <Table className={tableClassName} {...tableProps}>
        <TableHeader>{header}</TableHeader>
        <TableBody className={bodyClassName} showRowBorders={bodyShowRowBorders}>
          {children}
        </TableBody>
      </Table>
      {footer !== false && (
        <DataTableFooter
          totalLabel={totalLabel}
          currentPage={currentPage}
          totalPages={totalPages}
          pageItems={pageItems}
          onPageChange={onPageChange}
          pageSize={pageSize}
          goTo={goTo}
          className={cn("gap-3", footerClassName)}
        />
      )}
    </TableSurface>
  );

  if (shouldUseWorkbench) {
    return (
      <TableWorkbench
        title={title ?? null}
        subtitle={subtitle}
        filters={filters}
        filterPanelClassName={filterPanelClassName}
        search={search}
        actions={actions}
        className={className}
      >
        {tableContent}
      </TableWorkbench>
    );
  }

  return tableContent;
}
