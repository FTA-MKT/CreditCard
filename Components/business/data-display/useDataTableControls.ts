"use client";

import { useEffect, useMemo, useState } from "react";

import { getDataTablePageItems } from "@/components/business/data-display/DataTableWorkbench";
import type { DataTablePageItem } from "@/components/business/data-display/DataTableFooter";
import type { TableSortDirection } from "@/components/ui/table";

type SortAccessor<Row> = (row: Row) => string | number;

function compareText(left: string, right: string) {
  return left.localeCompare(right, undefined, { sensitivity: "base", numeric: true });
}

function compareNumber(left: number, right: number) {
  return left - right;
}

function sortRows<Row>(
  rows: Row[],
  direction: TableSortDirection,
  getter: SortAccessor<Row>,
) {
  if (direction === "none") return rows;

  return [...rows].sort((left, right) => {
    const leftValue = getter(left);
    const rightValue = getter(right);
    const comparison =
      typeof leftValue === "number" && typeof rightValue === "number"
        ? compareNumber(leftValue, rightValue)
        : compareText(String(leftValue), String(rightValue));

    return direction === "asc" ? comparison : -comparison;
  });
}

type UseDataTableStateOptions<
  Row,
  Filters extends Record<string, unknown>,
  SortKey extends string,
> = {
  data: Row[];
  initialSearch?: string;
  initialPage?: number;
  initialPageSize?: string;
  initialGoTo?: string;
  initialFilters?: Filters;
  searchPredicate?: (row: Row, query: string) => boolean;
  filterPredicate?: (row: Row, filters: Filters) => boolean;
  sortAccessors?: Partial<Record<SortKey, SortAccessor<Row>>>;
};

export type DataTableStateResult<
  Row,
  Filters extends Record<string, unknown> = Record<string, never>,
  SortKey extends string = string,
> = {
  search: string;
  setSearch: (value: string) => void;
  currentPage: number;
  setCurrentPage: (value: number) => void;
  pageSize: string;
  setPageSize: (value: string) => void;
  goToValue: string;
  setGoToValue: (value: string) => void;
  commitGoTo: () => void;
  filters: Filters;
  setFilter: <Key extends keyof Filters>(key: Key, value: Filters[Key]) => void;
  setFilters: (next: Filters | ((current: Filters) => Filters)) => void;
  resetFilters: () => void;
  sortKey: SortKey | null;
  sortDirection: TableSortDirection;
  getSortDirection: (key: SortKey) => TableSortDirection;
  setSort: (key: SortKey, direction: TableSortDirection) => void;
  rows: Row[];
  pageRows: Row[];
  totalRows: number;
  totalPages: number;
  safeCurrentPage: number;
  pageItems: DataTablePageItem[];
};

export function useDataTableState<
  Row,
  Filters extends Record<string, unknown> = Record<string, never>,
  SortKey extends string = string,
>({
  data,
  initialSearch = "",
  initialPage = 1,
  initialPageSize = "10",
  initialGoTo,
  initialFilters,
  searchPredicate,
  filterPredicate,
  sortAccessors,
}: UseDataTableStateOptions<Row, Filters, SortKey>): DataTableStateResult<Row, Filters, SortKey> {
  const [search, setSearchState] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [goToValue, setGoToValueState] = useState(initialGoTo ?? String(initialPage));
  const [filters, setFiltersState] = useState<Filters>(() => (initialFilters ?? ({} as Filters)));
  const [sortState, setSortState] = useState<{ key: SortKey | null; direction: TableSortDirection }>({
    key: null,
    direction: "none",
  });

  const normalizedSearch = search.trim().toLowerCase();

  const rows = useMemo(() => {
    const filteredRows = data.filter((row) => {
      const matchesSearch = !normalizedSearch || !searchPredicate || searchPredicate(row, normalizedSearch);
      if (!matchesSearch) return false;
      if (!filterPredicate) return true;
      return filterPredicate(row, filters);
    });

    if (!sortState.key || sortState.direction === "none" || !sortAccessors?.[sortState.key]) {
      return filteredRows;
    }

    return sortRows(filteredRows, sortState.direction, sortAccessors[sortState.key]!);
  }, [data, filterPredicate, filters, normalizedSearch, searchPredicate, sortAccessors, sortState]);

  const pageSizeNumber = Number(pageSize);
  const resolvedPageSize = Number.isFinite(pageSizeNumber) && pageSizeNumber > 0 ? pageSizeNumber : 10;
  const totalPages = Math.max(1, Math.ceil(rows.length / resolvedPageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const start = (safeCurrentPage - 1) * resolvedPageSize;
  const pageRows = rows.slice(start, start + resolvedPageSize);

  useEffect(() => {
    if (currentPage !== safeCurrentPage) setCurrentPage(safeCurrentPage);
  }, [currentPage, safeCurrentPage]);

  useEffect(() => {
    setGoToValueState(String(safeCurrentPage));
  }, [safeCurrentPage]);

  const setSearch = (value: string) => {
    setSearchState(value);
    setCurrentPage(1);
  };

  const setPageSize = (value: string) => {
    setPageSizeState(value);
    setCurrentPage(1);
  };

  const setGoToValue = (value: string) => {
    setGoToValueState(value.replace(/[^\d]/g, ""));
  };

  const setFilter = <Key extends keyof Filters>(key: Key, value: Filters[Key]) => {
    setFiltersState((current) => ({ ...current, [key]: value }));
    setCurrentPage(1);
  };

  const setFilters = (next: Filters | ((current: Filters) => Filters)) => {
    setFiltersState((current) => {
      if (typeof next === "function") {
        return (next as (current: Filters) => Filters)(current);
      }
      return next;
    });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFiltersState(initialFilters ?? ({} as Filters));
    setCurrentPage(1);
  };

  const setSort = (key: SortKey, direction: TableSortDirection) => {
    setSortState({ key: direction === "none" ? null : key, direction });
    setCurrentPage(1);
  };

  const commitGoTo = () => {
    const numeric = Number(goToValue);
    if (!Number.isFinite(numeric) || numeric < 1) {
      setGoToValueState(String(safeCurrentPage));
      return;
    }

    setCurrentPage(Math.min(Math.trunc(numeric), totalPages));
  };

  return {
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    goToValue,
    setGoToValue,
    commitGoTo,
    filters,
    setFilter,
    setFilters,
    resetFilters,
    sortKey: sortState.key,
    sortDirection: sortState.direction,
    getSortDirection: (key: SortKey) =>
      sortState.key === key ? sortState.direction : ("none" as TableSortDirection),
    setSort,
    rows,
    pageRows,
    totalRows: rows.length,
    totalPages,
    safeCurrentPage,
    pageItems: getDataTablePageItems(safeCurrentPage, totalPages),
  };
}

/**
 * @deprecated Prefer useDataTableState for all new page-level datatable work.
 */
export function useDataTableControls({
  totalPages,
  initialSearch = "",
  initialPage = 1,
  initialPageSize = "10",
}: {
  totalPages: number;
  initialSearch?: string;
  initialPage?: number;
  initialPageSize?: string;
}) {
  const [search, setSearchState] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const setSearch = (value: string) => {
    setSearchState(value);
    setCurrentPage(1);
  };

  const setPageSize = (value: string) => {
    setPageSizeState(value);
    setCurrentPage(1);
  };

  return {
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    pageItems: getDataTablePageItems(currentPage, totalPages),
  };
}
