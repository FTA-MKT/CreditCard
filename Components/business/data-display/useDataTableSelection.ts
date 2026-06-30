"use client";

import { useEffect, useState } from "react";

export type DataTableSelectionResult<RowId extends string | number> = {
  selectedIds: Set<RowId>;
  selectedCount: number;
  isSelected: (id: RowId) => boolean;
  toggleRow: (id: RowId, checked: boolean) => void;
  toggleAll: (checked: boolean) => void;
  clearSelection: () => void;
  allSelected: boolean;
  someSelected: boolean;
};

export function useDataTableSelection<RowId extends string | number>(
  rowIds: RowId[],
): DataTableSelectionResult<RowId> {
  const [selectedIds, setSelectedIds] = useState<Set<RowId>>(new Set());

  useEffect(() => {
    const currentIds = new Set(rowIds);
    setSelectedIds((previous) => {
      const next = new Set(Array.from(previous).filter((id) => currentIds.has(id)));
      return next.size === previous.size ? previous : next;
    });
  }, [rowIds]);

  const selectedCount = rowIds.filter((id) => selectedIds.has(id)).length;
  const allSelected = rowIds.length > 0 && selectedCount === rowIds.length;
  const someSelected = selectedCount > 0 && !allSelected;

  return {
    selectedIds,
    selectedCount,
    isSelected: (id: RowId) => selectedIds.has(id),
    toggleRow: (id: RowId, checked: boolean) => {
      setSelectedIds((previous) => {
        const next = new Set(previous);
        if (checked) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      });
    },
    toggleAll: (checked: boolean) => {
      setSelectedIds((previous) => {
        const next = new Set(previous);
        rowIds.forEach((id) => {
          if (checked) {
            next.add(id);
          } else {
            next.delete(id);
          }
        });
        return next;
      });
    },
    clearSelection: () => setSelectedIds((prev) => prev.size === 0 ? prev : new Set()),
    allSelected,
    someSelected,
  };
}
