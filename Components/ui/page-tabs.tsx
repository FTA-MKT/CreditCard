"use client"

import * as React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cva } from "class-variance-authority"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useHorizontalDragScroll } from "@/components/ui/use-horizontal-drag-scroll"
import { cn } from "@/lib/utils"

export type PageTabsSubItem = {
  value: string
  label: string
}

export type PageTabsItem = {
  value: string
  label: string
  items?: PageTabsSubItem[]
}

const pageTabsTriggerVariants = cva(
  "relative inline-flex h-full shrink-0 items-center justify-center whitespace-nowrap text-sm font-normal transition-all after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary after:opacity-0 after:transition-opacity",
  {
    variants: {
      active: {
        true: "font-medium text-foreground after:opacity-100",
        false: "text-muted-foreground hover:text-foreground",
      },
      hasMenu: {
        true: "gap-1",
        false: "",
      },
    },
    defaultVariants: {
      active: false,
      hasMenu: false,
    },
  }
)

function PageTabsTriggerButton({
  active = false,
  hasMenu = false,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  active?: boolean
  hasMenu?: boolean
}) {
  return (
    <button
      type="button"
      data-slot="page-tabs-trigger"
      data-active={active || undefined}
      className={cn(pageTabsTriggerVariants({ active, hasMenu }), className)}
      {...props}
    >
      {children}
    </button>
  )
}

function PageTabsSubmenuItemButton({
  active = false,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  active?: boolean
}) {
  return (
    <button
      type="button"
      data-slot="page-tabs-subitem"
      data-active={active || undefined}
      className={cn(
        "flex w-full items-center px-4 py-2.5 text-left text-sm transition-colors",
        active ? "bg-muted/60 text-foreground" : "text-foreground hover:bg-muted/50",
        className
      )}
      {...props}
    />
  )
}

export function PageTabs({
  items,
  value,
  onValueChange,
  className,
}: {
  items: PageTabsItem[]
  value: string | null
  onValueChange: (value: string) => void
  className?: string
}) {
  const [openMenu, setOpenMenu] = React.useState<string | null>(null)
  const { containerRef, dragScrollProps, isDragging, canDragScroll } =
    useHorizontalDragScroll<HTMLElement>()

  const activeParentValue = React.useMemo(
    () =>
      items.find((item) => item.items?.some((subItem) => subItem.value === value))?.value ?? null,
    [items, value]
  )

  return (
    <nav
      ref={containerRef}
      aria-label="Page tabs"
      data-slot="page-tabs"
      {...dragScrollProps}
      className={cn(
        "no-scrollbar flex h-full items-center gap-6 overflow-x-auto overflow-y-hidden touch-pan-x select-none",
        canDragScroll ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default",
        className
      )}
    >
      {items.map((item) => {
        const isActive = item.items?.length ? activeParentValue === item.value : value === item.value

        if (!item.items?.length) {
          return (
            <PageTabsTriggerButton
              key={item.value}
              active={isActive}
              onClick={() => {
                setOpenMenu(null)
                onValueChange(item.value)
              }}
            >
              {item.label}
            </PageTabsTriggerButton>
          )
        }

        const isOpen = openMenu === item.value

        return (
          <Popover
            key={item.value}
            open={isOpen}
            onOpenChange={(nextOpen) => setOpenMenu(nextOpen ? item.value : null)}
          >
            <PopoverTrigger asChild>
              <PageTabsTriggerButton active={isActive} hasMenu>
                <span>{item.label}</span>
                {isOpen ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
              </PageTabsTriggerButton>
            </PopoverTrigger>
            <PopoverContent align="start" sideOffset={10} className="w-44 p-0">
              <div className="py-2">
                {item.items.map((subItem) => (
                  <PageTabsSubmenuItemButton
                    key={subItem.value}
                    active={value === subItem.value}
                    onClick={() => {
                      onValueChange(subItem.value)
                      setOpenMenu(null)
                    }}
                  >
                    {subItem.label}
                  </PageTabsSubmenuItemButton>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )
      })}
    </nav>
  )
}

export function PageTabsShell({
  pageLabel,
  items,
  value,
  onValueChange,
  className,
  tabsClassName,
}: {
  pageLabel: string
  items: PageTabsItem[]
  value: string | null
  onValueChange: (value: string) => void
  className?: string
  tabsClassName?: string
}) {
  return (
    <div
      data-slot="page-tabs-shell"
      className={cn("flex h-full min-w-0 items-center gap-4 overflow-hidden", className)}
    >
      <span className="shrink-0 text-sm font-semibold text-foreground whitespace-nowrap">
        {pageLabel}
      </span>
      <div className="h-3 w-px shrink-0 bg-border" />
      <PageTabs
        items={items}
        value={value}
        onValueChange={onValueChange}
        className={cn("min-w-0 flex-1", tabsClassName)}
      />
    </div>
  )
}
