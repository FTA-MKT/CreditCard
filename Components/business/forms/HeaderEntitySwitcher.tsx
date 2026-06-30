"use client";

import * as React from "react";
import {
  Check,
  ChevronDown,
  RefreshCw,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputAddon, InputGroup } from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableActionCell,
  TableActionHead,
  TableBody,
  TableCell,
  TableCellText,
  TableFooterBar,
  TableHead,
  TableHeader,
  TableRow,
  TableSurface,
} from "@/components/ui/table";
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
import { cn } from "@/lib/utils";

const SEARCH_FIELD_OPTIONS = [
  { value: "groupLabel", label: "Group" },
  { value: "label", label: "Entity" },
  { value: "sublabel", label: "Identifier" },
] as const;

type SearchField = (typeof SEARCH_FIELD_OPTIONS)[number]["value"];

export type EntitySwitcherOption = {
  id: string;
  label: string;
  sublabel?: string;
  groupLabel?: string;
  description?: string;
  isAllOption?: boolean;
};

export type HeaderEntitySwitcherProps = {
  value: string;
  options: EntitySwitcherOption[];
  onValueChange: (value: string) => void;
  onRefresh?: () => void;
  advancedSearchContent?: React.ReactNode;
  className?: string;
};

type NormalizedEntitySwitcherOption = EntitySwitcherOption & {
  groupLabel: string;
  sublabel: string;
  displayLabel: string;
  description: string;
  isAllOption: boolean;
};

function normalizeOption(
  option: EntitySwitcherOption,
): NormalizedEntitySwitcherOption {
  const derivedGroupLabel = option.groupLabel ?? option.label;
  const derivedSublabel = option.sublabel ?? extractEntitySublabel(option.label);
  const isAllOption =
    option.isAllOption ??
    option.label.trim().toLowerCase() === "all";

  return {
    ...option,
    groupLabel: derivedGroupLabel,
    sublabel: derivedSublabel,
    displayLabel: formatEntityDisplayLabel(option.label, formatMaskedSublabel(derivedSublabel)),
    description: option.description ?? "",
    isAllOption,
  };
}

function extractEntitySublabel(label: string) {
  const match = label.match(/\((?:\.\.\.\.|…)?([^)]+)\)$/);
  return (match?.[1] ?? "").trim();
}

function formatEntityDisplayLabel(label: string, maskedSublabel: string) {
  if (!maskedSublabel) return label;
  if (label.includes(`(....${maskedSublabel})`) || label.includes(`(…${maskedSublabel})`)) {
    return label;
  }

  return `${label} (....${maskedSublabel})`;
}

function formatMaskedSublabel(value: string) {
  const digits = value.replace(/\s+/g, "");
  if (!digits) return "";
  return digits.slice(-4);
}

function clampPage(page: number, totalPages: number) {
  return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
}

function stopLink(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

export function HeaderEntitySwitcher({
  value,
  options,
  onValueChange,
  onRefresh,
  advancedSearchContent,
  className,
}: HeaderEntitySwitcherProps) {
  const [groupOpen, setGroupOpen] = React.useState(false);
  const [entityOpen, setEntityOpen] = React.useState(false);
  const [advancedOpen, setAdvancedOpen] = React.useState(false);
  const [searchBy, setSearchBy] = React.useState<SearchField>("label");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  const normalizedOptions = React.useMemo(
    () => options.map(normalizeOption),
    [options],
  );
  const normalizedSelectableOptions = React.useMemo(
    () => normalizedOptions.filter((option) => !option.isAllOption),
    [normalizedOptions],
  );

  const selectedOption = React.useMemo(() => {
    return (
      normalizedSelectableOptions.find((option) => option.id === value) ??
      normalizedSelectableOptions[0] ??
      normalizedOptions.find((option) => option.id === value) ??
      normalizedOptions[0]
    );
  }, [normalizedOptions, normalizedSelectableOptions, value]);

  const groupOptions = React.useMemo(() => {
    const seen = new Set<string>();
    return normalizedOptions.filter((option) => {
      if (seen.has(option.groupLabel)) return false;
      seen.add(option.groupLabel);
      return true;
    });
  }, [normalizedOptions]);

  const groupScopedOptions = React.useMemo(() => {
    if (!selectedOption) return normalizedSelectableOptions;
    return normalizedSelectableOptions.filter(
      (option) => option.groupLabel === selectedOption.groupLabel,
    );
  }, [normalizedSelectableOptions, selectedOption]);

  const advancedSearchOptions = React.useMemo(
    () => normalizedSelectableOptions,
    [normalizedSelectableOptions],
  );

  const filteredSearchRows = React.useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    if (!needle) return advancedSearchOptions;
    return advancedSearchOptions.filter((option) =>
      option[searchBy].toLowerCase().includes(needle),
    );
  }, [advancedSearchOptions, searchBy, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredSearchRows.length / pageSize));
  const currentPageRows = React.useMemo(() => {
    const nextPage = clampPage(currentPage, totalPages);
    const startIndex = (nextPage - 1) * pageSize;
    return filteredSearchRows.slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredSearchRows, totalPages]);

  React.useEffect(() => {
    setCurrentPage((page) => clampPage(page, totalPages));
  }, [totalPages]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchBy, searchQuery]);

  if (!selectedOption) return null;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center gap-1.5">
        <Popover
          open={groupOpen}
          onOpenChange={(open) => {
            setGroupOpen(open);
            if (open) setEntityOpen(false);
          }}
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              className="inline-flex max-w-full items-center gap-1 truncate text-[14px] leading-6 text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="truncate">{selectedOption.groupLabel}</span>
              <ChevronDown className="size-4 shrink-0" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" sideOffset={10} className="w-[480px] max-w-[min(480px,calc(100vw-2rem))] p-0">
            <Command>
              <CommandInput placeholder="Please enter" />
              <CommandList className="max-h-[320px]">
                <CommandEmpty>No group found.</CommandEmpty>
                <CommandGroup>
                  {groupOptions.map((option) => {
                    const isSelected =
                      option.groupLabel === selectedOption.groupLabel;
                    return (
                      <CommandItem
                        key={option.groupLabel}
                        value={option.groupLabel}
                        onSelect={() => {
                          const nextOption =
                            normalizedSelectableOptions.find(
                              (candidate) =>
                                candidate.groupLabel === option.groupLabel,
                            ) ??
                            normalizedOptions.find(
                              (candidate) =>
                                candidate.groupLabel === option.groupLabel,
                            );
                          if (nextOption) onValueChange(nextOption.id);
                          setGroupOpen(false);
                        }}
                      >
                        <span className="truncate">{option.groupLabel}</span>
                        <Check
                          className={cn(
                            "ml-auto size-4",
                            isSelected ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {onRefresh ? (
          <button
            type="button"
            className="inline-flex size-5 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground"
            onClick={onRefresh}
            aria-label="Refresh entities"
          >
            <RefreshCw className="size-4" />
          </button>
        ) : null}
      </div>

      <div className="flex min-w-0 items-center gap-2">
        <Popover
          open={entityOpen}
          onOpenChange={(open) => {
            setEntityOpen(open);
            if (open) setGroupOpen(false);
          }}
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              className="inline-flex min-w-0 max-w-[720px] items-center gap-1.5 text-left text-[18px] leading-7 text-primary transition-colors hover:text-primary/90"
            >
              <span className="truncate text-[18px] font-normal leading-7">{selectedOption.displayLabel}</span>
              <ChevronDown className="mt-px size-5 shrink-0 text-primary" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" sideOffset={10} className="w-[480px] max-w-[min(480px,calc(100vw-2rem))] p-0">
            <Command>
              <CommandInput placeholder="Please enter" />
              <CommandList className="max-h-[320px]">
                <CommandEmpty>No entity found.</CommandEmpty>
                <CommandGroup>
                  {groupScopedOptions.map((option) => {
                    const isSelected = option.id === selectedOption.id;

                    return (
                      <CommandItem
                        key={option.id}
                        value={`${option.label} ${option.sublabel}`}
                        onSelect={() => {
                          onValueChange(option.id);
                          setEntityOpen(false);
                        }}
                      >
                        <span className="truncate text-sm font-medium leading-5">
                          {option.displayLabel}
                        </span>
                        <Check
                          className={cn(
                            "ml-auto size-4",
                            isSelected ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div
          aria-hidden="true"
          className="h-4 w-px shrink-0 self-center bg-foreground/20"
        />

        <Button
          variant="link"
          size="sm"
          className="h-auto shrink-0 gap-1 rounded-none px-0 text-[16px] font-normal leading-7 text-primary"
          data-icon="trailing"
          onClick={() => setAdvancedOpen(true)}
        >
          Advanced Search
          <Search className="size-[16px]" />
        </Button>
      </div>

      <Dialog open={advancedOpen} onOpenChange={setAdvancedOpen}>
        <DialogContent className="flex max-h-[min(80vh,760px)] max-w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden rounded-[8px] border border-border bg-background p-0 sm:max-w-[1120px]">
          <DialogHeader className="border-b border-border px-5 py-4">
            <DialogTitle className="text-[15px] font-semibold leading-6 text-foreground">
              Select an Entity
            </DialogTitle>
          </DialogHeader>

          {advancedSearchContent ? (
            <div className="min-h-0 flex-1 overflow-auto p-5">{advancedSearchContent}</div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col gap-6 bg-background px-5 py-6">
              <div className="flex flex-none flex-col items-center gap-4">
                <div className="relative flex size-16 items-center justify-center">
                  <div className="absolute inset-x-2 top-1 h-3 rounded-t-[3px] bg-success" />
                  <div className="absolute left-2 top-4 h-8 w-8 rounded-[3px] border border-chart-4/50 bg-background" />
                  <div className="absolute right-2 top-4 h-8 w-8 rounded-[3px] border border-chart-2/50 bg-background" />
                  <div className="absolute left-5 top-6 h-7 w-7 rounded-[3px] border border-border bg-background shadow-sm" />
                  <Search className="absolute bottom-2 right-2 size-4 text-primary" />
                  <span className="absolute left-1 top-1 text-[10px] text-chart-1">+</span>
                  <span className="absolute right-1 top-0 text-[10px] text-chart-2">+</span>
                </div>

                <div className="w-full max-w-[532px] rounded-[12px]">
                  <InputGroup className="overflow-hidden rounded-[6px] border border-border bg-background">
                    <Select
                      value={searchBy}
                      onValueChange={(nextValue) => setSearchBy(nextValue as SearchField)}
                    >
                      <SelectTrigger className="h-[42px] w-[220px] rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SEARCH_FIELD_OPTIONS.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="h-[42px] rounded-none border-0 px-3 shadow-none focus-visible:ring-0"
                      placeholder="Please enter"
                    />
                    <InputAddon side="right" className="px-3 text-muted-foreground">
                      <Search className="size-[15px]" />
                    </InputAddon>
                  </InputGroup>
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col space-y-4">
                <div className="text-[15px] font-semibold leading-6 text-foreground">Entity</div>

                <TableSurface className="min-h-0 flex-1 overflow-auto rounded-[4px] border border-border">
                  <Table framed={false}>
                    <TableHeader>
                      <TableRow>
                        <TableHead columnId="group-label">Group</TableHead>
                        <TableHead columnId="entity-label">Entity</TableHead>
                        <TableHead columnId="entity-sublabel">Identifier</TableHead>
                        <TableHead columnId="entity-description">Description</TableHead>
                        <TableActionHead>Action</TableActionHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentPageRows.map((option) => (
                        <TableRow key={option.id}>
                          <TableCell>
                            <TableCellText primary={option.groupLabel} />
                          </TableCell>
                          <TableCell>
                            <TableCellText primary={option.label} />
                          </TableCell>
                          <TableCell>
                            <TableCellText primary={option.sublabel || "-"} mono />
                          </TableCell>
                          <TableCell>
                            <TableCellText primary={option.description || "-"} />
                          </TableCell>
                          <TableActionCell>
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto px-0 text-primary font-normal"
                              onClick={() => {
                                onValueChange(option.id);
                                setAdvancedOpen(false);
                              }}
                            >
                              Select
                            </Button>
                          </TableActionCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <TableFooterBar className="justify-between gap-4 px-4">
                    <span className="text-sm text-muted-foreground">
                      Total {filteredSearchRows.length} items
                    </span>
                    <div className="flex flex-wrap items-center justify-end gap-3">
                      <Pagination size="sm" className="mx-0 w-auto flex-none justify-end">
                        <PaginationContent size="sm">
                          <PaginationItem>
                            <PaginationPrevious
                              size="sm"
                              href="#"
                              onClick={(event) => {
                                stopLink(event);
                                if (currentPage > 1) setCurrentPage(currentPage - 1);
                              }}
                              className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
                            />
                          </PaginationItem>
                          {Array.from({ length: totalPages }, (_, index) => index + 1)
                            .slice(0, 6)
                            .map((page) => (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  href="#"
                                  onClick={(event) => {
                                    stopLink(event);
                                    setCurrentPage(page);
                                  }}
                                  isActive={page === currentPage}
                                  size="sm"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                          {totalPages > 6 ? (
                            <PaginationItem>
                              <PaginationEllipsis size="sm" />
                            </PaginationItem>
                          ) : null}
                          <PaginationItem>
                            <PaginationNext
                              size="sm"
                              href="#"
                              onClick={(event) => {
                                stopLink(event);
                                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                              }}
                              className={cn(
                                currentPage >= totalPages && "pointer-events-none opacity-50",
                              )}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                      <PaginationPageSize
                        size="sm"
                        value={String(pageSize)}
                        onValueChange={() => {}}
                        options={["10"]}
                      />
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Go to</span>
                        <div className="size-7 rounded-[4px] border border-border bg-background" />
                      </div>
                    </div>
                  </TableFooterBar>
                </TableSurface>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
