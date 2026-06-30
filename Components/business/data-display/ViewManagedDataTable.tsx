"use client";

import type React from "react";
import { Search } from "lucide-react";

import { DataTableFooter } from "@/components/business/data-display/DataTableFooter";
import type { DataTableStateResult } from "@/components/business/data-display/useDataTableControls";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableSurface, type TableProps } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type ViewManagedDataTableProps<
  Row,
  Filters extends Record<string, unknown> = Record<string, never>,
  SortKey extends string = string,
> = {
  state: DataTableStateResult<Row, Filters, SortKey>;
  viewLabel?: React.ReactNode;
  search: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    widthClassName?: string;
  };
  viewControls?: React.ReactNode;
  actions?: React.ReactNode;
  header: React.ReactNode;
  renderRows: (state: DataTableStateResult<Row, Filters, SortKey>) => React.ReactNode;
  emptyState?: React.ReactNode;
  totalLabel?: React.ReactNode | ((state: DataTableStateResult<Row, Filters, SortKey>) => React.ReactNode);
  pageSizeOptions?: Array<string | number>;
  showGoTo?: boolean;
  footer?: false | React.ReactNode;
  className?: string;
  toolbarClassName?: string;
  viewLabelClassName?: string;
  tableSurfaceClassName?: string;
  tableClassName?: string;
  bodyClassName?: string;
  bodyShowRowBorders?: boolean;
  tableProps?: Omit<TableProps, "children" | "className">;
};

export function ViewManagedDataTable<
  Row,
  Filters extends Record<string, unknown> = Record<string, never>,
  SortKey extends string = string,
>({
  state,
  viewLabel = "Filtered by Default",
  search,
  viewControls,
  actions,
  header,
  renderRows,
  emptyState,
  totalLabel,
  pageSizeOptions = ["10", "20", "50"],
  showGoTo = true,
  footer,
  className,
  toolbarClassName,
  viewLabelClassName,
  tableSurfaceClassName,
  tableClassName,
  bodyClassName,
  bodyShowRowBorders = true,
  tableProps,
}: ViewManagedDataTableProps<Row, Filters, SortKey>) {
  const resolvedTotalLabel =
    typeof totalLabel === "function" ? totalLabel(state) : (totalLabel ?? `Total ${state.totalRows} items`);

  const footerNode =
    footer === false ? null : (
      footer ?? (
        <DataTableFooter
          totalLabel={resolvedTotalLabel}
          currentPage={state.safeCurrentPage}
          totalPages={state.totalPages}
          pageItems={state.pageItems}
          onPageChange={state.setCurrentPage}
          pageSize={{
            value: state.pageSize,
            onValueChange: state.setPageSize,
            options: pageSizeOptions,
          }}
          goTo={
            showGoTo
              ? {
                  value: state.goToValue,
                  onValueChange: state.setGoToValue,
                  onCommit: state.commitGoTo,
                }
              : undefined
          }
        />
      )
    );

  return (
    <div className={cn("flex min-w-0 flex-1 flex-col gap-5", className)}>
      <div className={cn("flex flex-wrap items-center justify-between gap-4", toolbarClassName)}>
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <div className={cn("inline-flex items-center gap-2 text-[15px] font-semibold text-foreground", viewLabelClassName)}>
            {viewLabel}
          </div>
          <div className={cn("relative w-[13rem] max-w-full", search.widthClassName)}>
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              size="default"
              value={search.value}
              onChange={(event) => search.onChange(event.target.value)}
              placeholder={search.placeholder ?? "Search this list..."}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {viewControls}
          {actions}
        </div>
      </div>

      <TableSurface className={tableSurfaceClassName}>
        <Table framed={false} {...tableProps} className={tableClassName}>
          {header}
          <TableBody className={bodyClassName} showRowBorders={bodyShowRowBorders}>
            {state.pageRows.length > 0 ? renderRows(state) : emptyState}
          </TableBody>
        </Table>
        {footerNode}
      </TableSurface>
    </div>
  );
}
