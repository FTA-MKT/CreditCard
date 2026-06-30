"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type ComboboxOption = {
  value: string
  label: string
}

type ComboboxProps = {
  options: ComboboxOption[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  emptyText?: string
  searchPlaceholder?: string
  className?: string
  disabled?: boolean
  searchValue?: string
  onSearchValueChange?: (value: string) => void
}

function Combobox({
  options,
  value = "",
  onValueChange,
  placeholder = "Select option...",
  emptyText = "No results found.",
  searchPlaceholder = "Search...",
  className,
  disabled = false,
  searchValue,
  onSearchValueChange,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [internalSearchValue, setInternalSearchValue] = React.useState("")
  const resolvedSearchValue = searchValue ?? internalSearchValue
  const selectedOption = options.find((option) => option.value === value)
  const visibleOptions = resolvedSearchValue.trim()
    ? options.filter((option) =>
        option.label.toLowerCase().includes(resolvedSearchValue.trim().toLowerCase())
      )
    : options

  const handleSearchValueChange = (nextValue: string) => {
    onSearchValueChange?.(nextValue)
    if (searchValue === undefined) {
      setInternalSearchValue(nextValue)
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        if (!disabled) setOpen(nextOpen)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("justify-between font-normal", className)}
        >
          <span className={cn("truncate", !selectedOption && "text-muted-foreground")}>
            {selectedOption?.label ?? placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput
            value={resolvedSearchValue}
            onValueChange={handleSearchValueChange}
            placeholder={searchPlaceholder}
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {visibleOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(nextValue) => {
                    const resolvedValue = nextValue === value ? "" : nextValue
                    onValueChange(resolvedValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { Combobox }
export type { ComboboxOption, ComboboxProps }
