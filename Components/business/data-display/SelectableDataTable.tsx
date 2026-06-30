"use client";

import type React from "react";

import { StandardDataTable } from "@/components/business/data-display/StandardDataTable";
import type { DataTableStateResult } from "@/components/business/data-display/useDataTableControls";
import type { DataTableSelectionResult } from "@/components/business/data-display/useDataTableSelection";
import type { TableProps } from "@/components/ui/table";

type SelectableDataTableProps<
  Row,
  RowId extends string | number,
  Filters extends Record<string, unknown> = Record<string, never>,
  SortKey extends string = string,
> = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  filters?: React.ReactNode;
  search?: React.ComponentProps<typeof StandardDataTable<Row, Filters, SortKey>>["search"];
  actions?: React.ReactNode;
  state: DataTableStateResult<Row, Filters, SortKey>;
  selection: DataTableSelectionResult<RowId>;
  header: (selection: DataTableSelectionResult<RowId>) => React.ReactNode;
  renderRows: (
    state: DataTableStateResult<Row, Filters, SortKey>,
    selection: DataTableSelectionResult<RowId>,
  ) => React.ReactNode;
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

export function SelectableDataTable<
  Row,
  RowId extends string | number,
  Filters extends Record<string, unknown> = Record<string, never>,
  SortKey extends string = string,
>({
  selection,
  header,
  renderRows,
  ...props
}: SelectableDataTableProps<Row, RowId, Filters, SortKey>) {
  return (
    <StandardDataTable
      {...props}
      header={header(selection)}
      renderRows={(state) => renderRows(state, selection)}
    />
  );
}
