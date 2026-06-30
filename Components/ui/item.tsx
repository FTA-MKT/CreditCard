import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Item — generic list/menu row with icon, label, description, and right slot.
 * Useful for list views, settings rows, selection items, etc.
 */
interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  label: string
  description?: string
  right?: React.ReactNode
  /** Renders as a button-like interactive row */
  interactive?: boolean
}

function Item({
  className,
  icon,
  label,
  description,
  right,
  interactive = false,
  ...props
}: ItemProps) {
  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      className={cn(
        "flex items-center gap-3 rounded-[calc(var(--radius)+2px)] px-3 py-2.5",
        interactive && "cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-1 focus-visible:outline-ring",
        className
      )}
      {...props}
    >
      {icon && (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius)] bg-muted text-muted-foreground text-sm">
          {icon}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-none">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{description}</p>
        )}
      </div>
      {right && (
        <div className="shrink-0 text-muted-foreground">{right}</div>
      )}
    </div>
  )
}

// ── ItemGroup ─────────────────────────────────────────────────────────────────
interface ItemGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
}

function ItemGroup({ className, label, children, ...props }: ItemGroupProps) {
  return (
    <div className={cn("space-y-0.5", className)} {...props}>
      {label && (
        <p className="px-3 pb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
      )}
      {children}
    </div>
  )
}

export { Item, ItemGroup }
export type { ItemProps, ItemGroupProps }
