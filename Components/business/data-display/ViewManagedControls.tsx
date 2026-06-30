"use client";

import * as React from "react";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Filter,
  RefreshCw,
  Settings,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type ViewManagedFilterOperator = "Equals" | "Contains" | "Starts With";
type ViewVisibility = "private" | "all-users" | "teams";

export type ViewManagedFilterRule = {
  id: string;
  field: string;
  operator: ViewManagedFilterOperator;
  value: string;
};

const DEFAULT_VIEW_FILTER_FIELDS = ["Owner", "Status", "Record Type"];
const DEFAULT_VIEW_FILTER_OPERATORS: ViewManagedFilterOperator[] = ["Equals", "Contains", "Starts With"];

function buildFieldColumnState(available: readonly string[], selected: readonly string[]) {
  const sourceFields = [...new Set([...available, ...selected])];
  const normalizedSelected = [...new Set(selected)].filter((field) => sourceFields.includes(field));
  const normalizedAvailable = sourceFields.filter((field) => !normalizedSelected.includes(field));
  return {
    availableFields: normalizedAvailable,
    selectedFields: normalizedSelected,
  };
}

function ViewFieldColumn({
  title,
  count,
  items,
  selectedIds,
  searchValue,
  allSelected,
  someSelected,
  onSearchChange,
  onToggleAll,
  onToggle,
}: {
  title: string;
  count: number;
  items: string[];
  selectedIds: Set<string>;
  searchValue: string;
  allSelected: boolean;
  someSelected: boolean;
  onSearchChange: (value: string) => void;
  onToggleAll: (checked: boolean) => void;
  onToggle: (item: string, checked: boolean) => void;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-[calc(var(--radius)+2px)] border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-base font-semibold text-foreground">{title}</span>
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Checkbox
            checked={allSelected ? true : someSelected ? "indeterminate" : false}
            onCheckedChange={(checked) => onToggleAll(Boolean(checked))}
            aria-label={`Select all ${title.toLowerCase()}`}
          />
          <span>{count} items</span>
        </div>
      </div>

      <div className="p-4 pb-0">
        <Input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Please Enter"
        />
      </div>

      <ScrollArea className="h-[22rem] px-0 py-4">
        <div className="space-y-1">
          {items.map((item) => (
            <label
              key={item}
              className="flex cursor-pointer items-center justify-between gap-3 px-4 py-2 text-sm hover:bg-muted/30"
            >
              <span className="text-foreground">{item}</span>
              <Checkbox
                checked={selectedIds.has(item)}
                onCheckedChange={(checked) => onToggle(item, Boolean(checked))}
                aria-label={`Select ${item}`}
              />
            </label>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export function ViewManagedViewSelector({
  value,
  options,
  onValueChange,
}: {
  value: string;
  options: Array<{ value: string; label: string }>;
  onValueChange: (value: string) => void;
}) {
  const selectedLabel = options.find((option) => option.value === value)?.label ?? value;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto gap-2 px-0 py-0 has-[>svg]:px-0 text-[15px] font-semibold text-foreground hover:bg-transparent"
        >
          <span>{selectedLabel}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[16rem]">
        <DropdownMenuLabel className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          List View
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ViewManagedToolbarControls({
  fieldOptions,
  filters,
  onRefresh,
  onSelectedFieldsSave,
  onCreateView,
}: {
  fieldOptions: {
    available: readonly string[];
    selected: readonly string[];
  };
  filters?: {
    summaryLabel?: string;
    summaryValue?: string;
    fields?: readonly string[];
    operators?: readonly ViewManagedFilterOperator[];
    initialRules?: ViewManagedFilterRule[];
    onApply?: (rules: ViewManagedFilterRule[]) => void;
  };
  onRefresh?: () => void;
  onSelectedFieldsSave?: (selectedFields: string[]) => void;
  onCreateView?: (view: {
    name: string;
    apiName: string;
    visibility: ViewVisibility;
    selectedFields: string[];
    rules: ViewManagedFilterRule[];
  }) => void;
}) {
  const initialFieldState = React.useMemo(
    () => buildFieldColumnState(fieldOptions.available, fieldOptions.selected),
    [fieldOptions.available, fieldOptions.selected],
  );
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [addFilterOpen, setAddFilterOpen] = React.useState(false);
  const [newViewOpen, setNewViewOpen] = React.useState(false);
  const [fieldDialogOpen, setFieldDialogOpen] = React.useState(false);
  const [newViewName, setNewViewName] = React.useState("");
  const [newViewApiName, setNewViewApiName] = React.useState("");
  const [visibility, setVisibility] = React.useState<ViewVisibility>("private");
  const filterFields = React.useMemo(
    () => (filters?.fields && filters.fields.length > 0 ? [...new Set(filters.fields)] : DEFAULT_VIEW_FILTER_FIELDS),
    [filters?.fields],
  );
  const filterOperators = React.useMemo(
    () =>
      filters?.operators && filters.operators.length > 0
        ? [...new Set(filters.operators)]
        : DEFAULT_VIEW_FILTER_OPERATORS,
    [filters?.operators],
  );
  const defaultRules = React.useMemo<ViewManagedFilterRule[]>(
    () =>
      filters?.initialRules ?? [
        { id: "filter-owner", field: filterFields[0] ?? "Owner", operator: "Equals", value: "Default" },
      ],
    [filterFields, filters?.initialRules],
  );
  const filterSummaryLabel = filters?.summaryLabel ?? "Filter By Owner";
  const filterSummaryValue =
    filters?.summaryValue ??
    (defaultRules.length > 0 ? `${defaultRules.length} active filter${defaultRules.length === 1 ? "" : "s"}` : "All records");
  const [rules, setRules] = React.useState<ViewManagedFilterRule[]>(defaultRules);
  const [draftField, setDraftField] = React.useState<string>(filterFields[0] ?? "Owner");
  const [draftOperator, setDraftOperator] = React.useState<ViewManagedFilterOperator>(filterOperators[0] ?? "Equals");
  const [draftValue, setDraftValue] = React.useState("");
  const [availableFields, setAvailableFields] = React.useState<string[]>(initialFieldState.availableFields);
  const [selectedFields, setSelectedFields] = React.useState<string[]>(initialFieldState.selectedFields);
  const [availableSearch, setAvailableSearch] = React.useState("");
  const [selectedSearch, setSelectedSearch] = React.useState("");
  const [checkedAvailable, setCheckedAvailable] = React.useState<Set<string>>(new Set());
  const [checkedSelected, setCheckedSelected] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    const next = buildFieldColumnState(fieldOptions.available, fieldOptions.selected);
    setAvailableFields(next.availableFields);
    setSelectedFields(next.selectedFields);
  }, [fieldOptions.available, fieldOptions.selected]);

  React.useEffect(() => {
    setRules(defaultRules);
  }, [defaultRules]);

  React.useEffect(() => {
    if (!filterFields.includes(draftField)) {
      setDraftField(filterFields[0] ?? "Owner");
    }
  }, [draftField, filterFields]);

  React.useEffect(() => {
    if (!filterOperators.includes(draftOperator)) {
      setDraftOperator(filterOperators[0] ?? "Equals");
    }
  }, [draftOperator, filterOperators]);

  React.useEffect(() => {
    setCheckedAvailable((prev) => new Set([...prev].filter((field) => availableFields.includes(field))));
  }, [availableFields]);

  React.useEffect(() => {
    setCheckedSelected((prev) => new Set([...prev].filter((field) => selectedFields.includes(field))));
  }, [selectedFields]);

  const filteredAvailableFields = React.useMemo(
    () =>
      availableFields.filter((field) =>
        field.toLowerCase().includes(availableSearch.trim().toLowerCase()),
      ),
    [availableFields, availableSearch],
  );

  const filteredSelectedFields = React.useMemo(
    () =>
      selectedFields.filter((field) =>
        field.toLowerCase().includes(selectedSearch.trim().toLowerCase()),
      ),
    [selectedFields, selectedSearch],
  );

  const availableAllSelected =
    filteredAvailableFields.length > 0 &&
    filteredAvailableFields.every((field) => checkedAvailable.has(field));
  const availableSomeSelected =
    filteredAvailableFields.some((field) => checkedAvailable.has(field)) && !availableAllSelected;
  const selectedAllSelected =
    filteredSelectedFields.length > 0 &&
    filteredSelectedFields.every((field) => checkedSelected.has(field));
  const selectedSomeSelected =
    filteredSelectedFields.some((field) => checkedSelected.has(field)) && !selectedAllSelected;

  function addRule() {
    if (!draftValue.trim()) return;
    setRules((prev) => [
      ...prev,
      {
        id: `filter-${prev.length + 1}`,
        field: draftField,
        operator: draftOperator,
        value: draftValue.trim(),
      },
    ]);
    setAddFilterOpen(false);
    setDraftValue("");
  }

  function removeRule(id: string) {
    setRules((prev) => prev.filter((rule) => rule.id !== id));
  }

  function moveToSelected() {
    if (checkedAvailable.size === 0) return;
    const moved = availableFields.filter((field) => checkedAvailable.has(field));
    setAvailableFields((prev) => prev.filter((field) => !checkedAvailable.has(field)));
    setSelectedFields((prev) => [...prev, ...moved]);
    setCheckedAvailable(new Set());
  }

  function moveToAvailable() {
    if (checkedSelected.size === 0) return;
    const moved = selectedFields.filter((field) => checkedSelected.has(field));
    setSelectedFields((prev) => prev.filter((field) => !checkedSelected.has(field)));
    setAvailableFields((prev) => [...prev, ...moved]);
    setCheckedSelected(new Set());
  }

  function moveCheckedSelected(direction: "up" | "down") {
    if (checkedSelected.size !== 1) return;
    const [target] = [...checkedSelected];
    const index = selectedFields.indexOf(target);
    if (index < 0) return;
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= selectedFields.length) return;
    const next = [...selectedFields];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    setSelectedFields(next);
  }

  function handleFilterOpenChange(open: boolean) {
    setFiltersOpen(open);
    if (open) {
      setRules(defaultRules);
      setDraftValue("");
      setAddFilterOpen(false);
    }
  }

  return (
    <>
      <Button variant="ghost" size="icon-sm" aria-label="Refresh list" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4" />
      </Button>

      {filters ? (
        <Popover open={filtersOpen} onOpenChange={handleFilterOpenChange}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Open filters">
              <Filter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[28rem] p-0">
            <div className="border-b border-border px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <PopoverHeader className="gap-0">
                  <PopoverTitle className="text-lg font-semibold">Filters</PopoverTitle>
                </PopoverHeader>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close filters"
                  onClick={() => setFiltersOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-5 p-4">
              <div className="rounded-[calc(var(--radius)+2px)] border border-border bg-card px-4 py-3">
                <div className="text-sm font-medium text-foreground">{filterSummaryLabel}</div>
                <div className="mt-1 text-sm text-muted-foreground">{filterSummaryValue}</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <Popover open={addFilterOpen} onOpenChange={setAddFilterOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto px-0"
                        onClick={() => {
                          setDraftField(filterFields[0] ?? "Owner");
                          setDraftOperator(filterOperators[0] ?? "Equals");
                          setDraftValue("");
                        }}
                      >
                        Add Filter
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent side="right" align="start" sideOffset={16} className="w-[28rem] p-0">
                      <div className="space-y-4 p-4">
                        <div className="space-y-2">
                          <Label>Field</Label>
                          <Select value={draftField} onValueChange={setDraftField}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {filterFields.map((field) => (
                                <SelectItem key={field} value={field}>
                                  {field}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Operator</Label>
                          <Select
                            value={draftOperator}
                            onValueChange={(value) => setDraftOperator(value as ViewManagedFilterOperator)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {filterOperators.map((operator) => (
                                <SelectItem key={operator} value={operator}>
                                  {operator}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Value</Label>
                          <Input
                            value={draftValue}
                            onChange={(event) => setDraftValue(event.target.value)}
                            placeholder="Please Input"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 border-t border-border px-4 py-4">
                        <Button variant="outline" onClick={() => setAddFilterOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addRule}>Done</Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto px-0"
                    onClick={() => setRules([])}
                  >
                    Remove All
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Matching all of these filters</div>
                  {rules.length > 0 ? (
                    rules.map((rule) => (
                      <div
                        key={rule.id}
                        className="flex items-center justify-between gap-3 rounded-[calc(var(--radius)+2px)] border border-border bg-muted/20 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-foreground">
                            {rule.field} {rule.operator}
                          </div>
                          <div className="text-sm text-muted-foreground">{rule.value}</div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Remove ${rule.field} filter`}
                          onClick={() => removeRule(rule.id)}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[calc(var(--radius)+2px)] border border-dashed border-border bg-muted/10 px-4 py-3 text-sm text-muted-foreground">
                      No filters added yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-border px-4 py-4">
              <Button type="button" variant="outline" onClick={() => handleFilterOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  filters.onApply?.(rules);
                  setFiltersOpen(false);
                }}
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      ) : null}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Open list view controls">
            <Settings className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[18rem]">
          <DropdownMenuLabel className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            List View Controls
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setNewViewOpen(true);
            }}
          >
            New
          </DropdownMenuItem>
          <DropdownMenuItem>Clone</DropdownMenuItem>
          <DropdownMenuItem disabled>Rename</DropdownMenuItem>
          <DropdownMenuItem disabled>Sharing Settings</DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setFieldDialogOpen(true);
            }}
          >
            Select Fields to Display
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={newViewOpen} onOpenChange={setNewViewOpen}>
        <DialogContent className="sm:max-w-[44rem]">
          <DialogHeader className="border-b border-border pb-4">
            <DialogTitle>New List View</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>List Name</Label>
              <Input value={newViewName} onChange={(event) => setNewViewName(event.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>List API Name</Label>
              <Input value={newViewApiName} onChange={(event) => setNewViewApiName(event.target.value)} />
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium text-foreground">Who sees this list view?</div>
              <RadioGroup value={visibility} onValueChange={(value) => setVisibility(value as ViewVisibility)}>
                <label className="flex items-center gap-3 text-sm text-foreground">
                  <RadioGroupItem value="private" />
                  <span>Only I can see this list view</span>
                </label>
                <label className="flex items-center gap-3 text-sm text-foreground">
                  <RadioGroupItem value="all-users" />
                  <span>All users can see this list view</span>
                </label>
                <label className="flex items-center gap-3 text-sm text-foreground">
                  <RadioGroupItem value="teams" />
                  <span>Share list view with teams of users</span>
                </label>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setNewViewOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!newViewName.trim()) return;
                onCreateView?.({
                  name: newViewName.trim(),
                  apiName: newViewApiName.trim() || newViewName.trim(),
                  visibility,
                  selectedFields,
                  rules,
                });
                setNewViewOpen(false);
                setNewViewName("");
                setNewViewApiName("");
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={fieldDialogOpen} onOpenChange={setFieldDialogOpen}>
        <DialogContent className="sm:max-w-[64rem]">
          <DialogHeader className="border-b border-border pb-4">
            <DialogTitle>Select Fields to Display</DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-3">
            <ViewFieldColumn
              title="Available Fields"
              count={availableFields.length}
              items={filteredAvailableFields}
              selectedIds={checkedAvailable}
              searchValue={availableSearch}
              allSelected={availableAllSelected}
              someSelected={availableSomeSelected}
              onSearchChange={setAvailableSearch}
              onToggleAll={(checked) =>
                setCheckedAvailable((prev) => {
                  const next = new Set(prev);
                  filteredAvailableFields.forEach((field) => {
                    if (checked) next.add(field);
                    else next.delete(field);
                  });
                  return next;
                })
              }
              onToggle={(item, checked) =>
                setCheckedAvailable((prev) => {
                  const next = new Set(prev);
                  if (checked) next.add(item);
                  else next.delete(item);
                  return next;
                })
              }
            />

            <div className="flex shrink-0 flex-col gap-3">
              <Button variant="outline" size="icon-sm" onClick={moveToSelected} aria-label="Move selected fields right">
                <ChevronRight className="size-4" />
              </Button>
              <Button variant="outline" size="icon-sm" onClick={moveToAvailable} aria-label="Move selected fields left">
                <ChevronLeft className="size-4" />
              </Button>
            </div>

            <ViewFieldColumn
              title="Selected Fields"
              count={selectedFields.length}
              items={filteredSelectedFields}
              selectedIds={checkedSelected}
              searchValue={selectedSearch}
              allSelected={selectedAllSelected}
              someSelected={selectedSomeSelected}
              onSearchChange={setSelectedSearch}
              onToggleAll={(checked) =>
                setCheckedSelected((prev) => {
                  const next = new Set(prev);
                  filteredSelectedFields.forEach((field) => {
                    if (checked) next.add(field);
                    else next.delete(field);
                  });
                  return next;
                })
              }
              onToggle={(item, checked) =>
                setCheckedSelected((prev) => {
                  const next = new Set(prev);
                  if (checked) next.add(item);
                  else next.delete(item);
                  return next;
                })
              }
            />

            <div className="flex shrink-0 flex-col gap-3">
              <Button variant="outline" size="icon-sm" onClick={() => moveCheckedSelected("up")} aria-label="Move selected field up">
                <ChevronUp className="size-4" />
              </Button>
              <Button variant="outline" size="icon-sm" onClick={() => moveCheckedSelected("down")} aria-label="Move selected field down">
                <ChevronDown className="size-4" />
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFieldDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSelectedFieldsSave?.(selectedFields);
                setFieldDialogOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
