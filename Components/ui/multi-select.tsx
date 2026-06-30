"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
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

export type MultiSelectOption = {
  value: string
  label: string
}

type MultiSelectProps = {
  options: MultiSelectOption[]
  value: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  emptyText?: string
  searchPlaceholder?: string
  className?: string
  disabled?: boolean
}

const multiSelectTriggerVariants = cva(
  "flex h-9 w-full items-center justify-between rounded-[var(--radius)] border border-input bg-background px-3 py-2 text-sm transition-[color,box-shadow,border-color,background-color] outline-none hover:border-ring/40 focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring aria-invalid:border-destructive disabled:border-border disabled:bg-muted/60 disabled:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed"
)

function MultiSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select options",
  emptyText = "No options found.",
  searchPlaceholder = "Search...",
  className,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const selectedOptions = options.filter((option) => value.includes(option.value))
  const visibleOptions = query.trim()
    ? options.filter((option) =>
        option.label.toLowerCase().includes(query.trim().toLowerCase())
      )
    : options

  const toggleValue = (nextValue: string) => {
    onValueChange(
      value.includes(nextValue)
        ? value.filter((item) => item !== nextValue)
        : [...value, nextValue]
    )
  }

  const removeValue = (nextValue: string) => {
    onValueChange(value.filter((item) => item !== nextValue))
  }

  const clearAll = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    onValueChange([])
  }

  return (
    <Popover open={open} onOpenChange={(nextOpen) => {
      if (!disabled) setOpen(nextOpen)
    }}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-disabled={disabled}
          tabIndex={0}
          className={cn(multiSelectTriggerVariants(), className)}
          onKeyDown={(event) => {
            if (disabled) return
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              setOpen((current) => !current)
            }
          }}
        >
          <span className="flex min-w-0 flex-1 flex-nowrap items-center gap-1.5 overflow-hidden">
            {selectedOptions.length ? (
              selectedOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="max-w-full gap-1 rounded-md px-2 py-0.5 font-normal"
                >
                  <span className="truncate">{option.label}</span>
                  <button
                    type="button"
                    className="rounded-xs text-muted-foreground transition-colors hover:text-foreground"
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      removeValue(option.value)
                    }}
                    aria-label={`Remove ${option.label}`}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="truncate text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <span className="ml-2 flex items-center gap-1 text-muted-foreground">
            {selectedOptions.length ? (
              <button
                type="button"
                className="rounded-xs transition-colors hover:text-foreground"
                onClick={clearAll}
                aria-label="Clear selected values"
                disabled={disabled}
              >
                <X className="size-4" />
              </button>
            ) : null}
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder={searchPlaceholder}
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {visibleOptions.map((option) => {
                const checked = value.includes(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => toggleValue(option.value)}
                  >
                    <span>{option.label}</span>
                    <Check className={cn("ml-auto size-4", checked ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { MultiSelect }
export type { MultiSelectProps }
