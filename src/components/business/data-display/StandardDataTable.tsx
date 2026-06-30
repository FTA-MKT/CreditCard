"use client";

import type React from "react";

import { DataTableWorkbench } from "@/components/business/data-display/DataTableWorkbench";
import type { DataTableStateResult } from "@/components/business/data-display/useDataTableControls";
import {
  Table,
  TableBody,
  type TableProps,
} from "@/components/ui/table";

type StandardDataTableProps<
  Row,
  Filters extends Record<string, unknown> = Record<string, never>,
  SortKey extends string = string,
> = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  filters?: React.ReactNode;
  search?: React.ComponentProps<typeof DataTableWorkbench>["search"];
  actions?: React.ReactNode;
  state: DataTableStateResult<Row, Filters, SortKey>;
  header: React.ReactNode;
  renderRows: (state: DataTableStateResult<Row, Filters, SortKey>) => React.ReactNode;
  emptyState?: React.ReactNode;
  totalLabel?: React.ReactNode | ((state: DataTableStateResult<Row, Filters, SortKey>) => React.ReactNode);
  pageSizeOptions?: Array<string | number>;
  showGoTo?: boolean;
  footer?: false | React.ReactNode;
  surfaceClassName?: string;
  footerClassName?: string;
  tableClassName?: string;
  bodyClassName?: string;
  bodyShowRowBorders?: boolean;
  tableProps?: Omit<TableProps, "children" | "className">;
  className?: string;
};

export function StandardDataTable<
  Row,
  Filters extends Record<string, unknown> = Record<string, never>,
  SortKey extends string = string,
>({
  title,
  subtitle,
  filters,
  search,
  actions,
  state,
  header,
  renderRows,
  emptyState,
  totalLabel,
  pageSizeOptions = ["10", "20", "50"],
  showGoTo = false,
  footer,
  surfaceClassName,
  footerClassName,
  tableClassName,
  bodyClassName,
  bodyShowRowBorders = true,
  tableProps,
  className,
}: StandardDataTableProps<Row, Filters, SortKey>) {
  const resolvedTotalLabel =
    typeof totalLabel === "function" ? totalLabel(state) : (totalLabel ?? `Total ${state.totalRows} items`);
  const footerProps =
    footer === false
      ? { footer: false as const }
      : {
          footer,
          totalLabel: resolvedTotalLabel,
          currentPage: state.safeCurrentPage,
          totalPages: state.totalPages,
          pageItems: state.pageItems,
          onPageChange: state.setCurrentPage,
          pageSize: {
            value: state.pageSize,
            onValueChange: state.setPageSize,
            options: pageSizeOptions,
          },
          goTo: showGoTo
            ? {
                value: state.goToValue,
                onValueChange: state.setGoToValue,
                onCommit: state.commitGoTo,
              }
            : undefined,
        };

  return (
    <DataTableWorkbench
      title={title}
      subtitle={subtitle}
      filters={filters}
      search={search}
      actions={actions}
      className={className}
      surfaceClassName={surfaceClassName}
      footerClassName={footerClassName}
      {...footerProps}
    >
      <Table
        framed={false}
        {...tableProps}
        className={tableClassName}
      >
        {header}
        <TableBody className={bodyClassName} showRowBorders={bodyShowRowBorders}>
          {state.pageRows.length > 0 ? renderRows(state) : emptyState}
        </TableBody>
      </Table>
    </DataTableWorkbench>
  );
}
