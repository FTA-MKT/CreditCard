"use client"

import * as React from "react"
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type TableSize = "sm" | "md" | "lg"
type TableTone = "neutral" | "primary" | "success" | "warning" | "info" | "destructive"
type TableSortDirection = "asc" | "desc" | "none"
type TableColumnWidthMap = Record<string, number>
type TableNumberFormat = "currency" | "percent" | "integer" | "decimal"
type TableWidthBehavior = "content" | "fill"

const tableSizeStyles: Record<
  TableSize,
  {
    head: string
    cell: string
    fieldGap: string
    title: string
    supporting: string
    avatar: React.ComponentProps<typeof Avatar>["size"]
    checkbox: string
    image: string
  }
> = {
  sm: {
    head: "h-8 px-3 text-[11px]",
    cell: "px-3 py-2 text-xs",
    fieldGap: "gap-2",
    title: "text-xs",
    supporting: "text-[11px]",
    avatar: "sm",
    checkbox: "size-3.5",
    image: "size-7",
  },
  md: {
    head: "h-9 px-3 text-sm",
    cell: "px-3 py-2.5 text-sm",
    fieldGap: "gap-2.5",
    title: "text-sm",
    supporting: "text-xs",
    avatar: "sm",
    checkbox: "size-4",
    image: "size-8",
  },
  lg: {
    head: "h-11 px-4 text-sm",
    cell: "px-4 py-3 text-sm",
    fieldGap: "gap-3",
    title: "text-sm",
    supporting: "text-xs",
    avatar: "sm",
    checkbox: "size-4",
    image: "size-10",
  },
}

const tableToneStyles: Record<
  TableTone,
  {
    text: string
    dot: string
    track: string
    indicator: string
  }
> = {
  neutral: {
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
    track: "bg-muted",
    indicator: "bg-foreground/70",
  },
  primary: {
    text: "text-primary",
    dot: "bg-primary",
    track: "bg-primary/15",
    indicator: "bg-primary",
  },
  success: {
    text: "text-[var(--success)]",
    dot: "bg-[var(--success)]",
    track: "bg-success/15",
    indicator: "bg-success",
  },
  warning: {
    text: "text-[var(--warning)]",
    dot: "bg-[var(--warning)]",
    track: "bg-warning/15",
    indicator: "bg-warning",
  },
  info: {
    text: "text-[var(--info)]",
    dot: "bg-[var(--info)]",
    track: "bg-info/15",
    indicator: "bg-info",
  },
  destructive: {
    text: "text-destructive",
    dot: "bg-destructive",
    track: "bg-destructive/15",
    indicator: "bg-destructive",
  },
}

type TableContextValue = {
  size: TableSize
  stickyHeader: boolean
  zebra: boolean
  resizable: boolean
  showColumnBorders: boolean
  hasHorizontalOverflow: boolean
  hasActionColumn: boolean
  columnWidths: TableColumnWidthMap
  setColumnWidth: (columnId: string, width: number) => void
  setColumnWidths: React.Dispatch<React.SetStateAction<TableColumnWidthMap>>
}

const TableContext = React.createContext<TableContextValue>({
  size: "md",
  stickyHeader: false,
  zebra: false,
  resizable: true,
  showColumnBorders: true,
  hasHorizontalOverflow: false,
  hasActionColumn: false,
  columnWidths: {},
  setColumnWidth: () => {},
  setColumnWidths: () => {},
})

function useTableContext() {
  return React.useContext(TableContext)
}

interface TableProps extends React.ComponentProps<"table"> {
  size?: TableSize
  stickyHeader?: boolean
  zebra?: boolean
  resizable?: boolean
  showColumnBorders?: boolean
  defaultColumnWidths?: TableColumnWidthMap
  framed?: boolean
  widthBehavior?: TableWidthBehavior
}

function TableSurface({
  className,
  children,
  variant = "default",
  style,
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "embedded"
}) {
  return (
    <div
      data-slot="table-surface"
      data-variant={variant}
      className={cn(
        "max-w-full overflow-hidden bg-background",
        variant === "default" && "rounded-[var(--radius)] border",
        variant === "embedded" && "rounded-none border-0 bg-transparent",
        className
      )}
      style={
        variant === "default"
          ? {
              borderWidth: "var(--surface-border-width)",
              borderColor: "var(--surface-border-color)",
              boxShadow: "var(--surface-shadow)",
              ...style,
            }
          : style
      }
      {...props}
    >
      {children}
    </div>
  )
}

function TableFooterBar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="table-footer-bar"
      className={cn(
        className,
        "flex h-12 flex-nowrap items-center justify-end gap-4 border-t border-border px-4"
      )}
      {...props}
    />
  )
}

type TableColumnProps = {
  columnId?: string
  minWidth?: number
  maxWidth?: number
  measureWidth?: number
  resizable?: boolean
}

function getActionStickyStyles(shadow = true) {
  return cn(
    "sticky -right-px z-[12] isolate w-0 min-w-max whitespace-nowrap border-l border-border",
    shadow && "shadow-[-10px_0_14px_-12px_color-mix(in_oklab,var(--foreground)_14%,transparent)]"
  )
}

function getPinnedLeftStickyStyles(shadow = true) {
  return cn(
    "sticky left-0 z-[12] isolate whitespace-nowrap border-r border-border",
    shadow && "shadow-[10px_0_14px_-12px_color-mix(in_oklab,var(--foreground)_14%,transparent)]"
  )
}

function Table({
  className,
  style,
  size = "md",
  stickyHeader = false,
  zebra = false,
  resizable = true,
  showColumnBorders = true,
  defaultColumnWidths = {},
  framed = false,
  widthBehavior = "content",
  ...props
}: TableProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const tableRef = React.useRef<HTMLTableElement>(null)
  const [columnWidths, setColumnWidths] =
    React.useState<TableColumnWidthMap>({})
  const [hasHorizontalOverflow, setHasHorizontalOverflow] = React.useState(false)
  const [hasActionColumn, setHasActionColumn] = React.useState(false)
  const resolvedColumnWidths = React.useMemo(
    () => ({ ...defaultColumnWidths, ...columnWidths }),
    [defaultColumnWidths, columnWidths]
  )
  const hasControlledColumnWidths = Object.keys(columnWidths).length > 0
  const resolvedColumnWidthSum = React.useMemo(
    () => Object.values(resolvedColumnWidths).reduce((sum, width) => sum + width, 0),
    [resolvedColumnWidths]
  )

  const setColumnWidth = React.useCallback((columnId: string, width: number) => {
    setColumnWidths((current) => ({ ...current, [columnId]: width }))
  }, [])

  React.useLayoutEffect(() => {
    const container = containerRef.current
    const table = tableRef.current

    if (!container || !table) return

    const updateOverflow = () => {
      const actionColumnFound = Boolean(
        table.querySelector('[data-slot="table-action-head"], [data-slot="table-action-cell"]')
      )
      const rows = Array.from(table.rows)
      const minWidthsByColumn = new Map<string, number>()

      rows.forEach((row) => {
        Array.from(row.cells).forEach((cell, index) => {
          const element = cell as HTMLElement
          const columnKey = element.dataset.columnId || `index:${index}`
          const declaredMeasureWidth =
            Number.parseFloat(element.dataset.overflowBasis || element.dataset.minWidth || "0") || 0
          const controlledWidth = element.dataset.columnId
            ? (resolvedColumnWidths[element.dataset.columnId] ?? 0)
            : 0
          const columnWidth = Math.max(declaredMeasureWidth, controlledWidth)
          const currentWidth = minWidthsByColumn.get(columnKey) ?? 0
          minWidthsByColumn.set(columnKey, Math.max(currentWidth, columnWidth))
        })
      })

      const minimumWidthSum = Array.from(minWidthsByColumn.values()).reduce(
        (sum, width) => sum + width,
        0
      )
      const naturalOverflow =
        minimumWidthSum - container.clientWidth > 1 || table.scrollWidth - container.clientWidth > 1

      setHasActionColumn(actionColumnFound)
      setHasHorizontalOverflow(actionColumnFound && naturalOverflow)
    }

    updateOverflow()

    const resizeObserver = new ResizeObserver(() => {
      updateOverflow()
    })

    resizeObserver.observe(container)
    resizeObserver.observe(table)
    window.addEventListener("resize", updateOverflow)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", updateOverflow)
    }
  }, [resolvedColumnWidths, framed, size, stickyHeader, zebra, resizable])

  return (
    <TableContext.Provider
      value={{
        size,
        stickyHeader,
        zebra,
        resizable,
        showColumnBorders,
        hasHorizontalOverflow,
        hasActionColumn,
        columnWidths: resolvedColumnWidths,
        setColumnWidth,
        setColumnWidths,
      }}
    >
      <div
        ref={containerRef}
        data-slot="table-container"
        data-size={size}
        data-framed={framed || undefined}
        className={cn(
          "relative w-full max-w-full overflow-x-auto",
          framed && "rounded-[var(--radius)] border bg-background"
        )}
        style={
          framed
            ? {
                borderWidth: "var(--surface-border-width)",
                borderColor: "var(--surface-border-color)",
                boxShadow: "var(--surface-shadow)",
              }
            : undefined
        }
      >
        <table
          ref={tableRef}
          data-slot="table"
          data-size={size}
          data-sticky-header={stickyHeader || undefined}
          data-zebra={zebra || undefined}
          data-width-behavior={widthBehavior}
          className={cn(
            widthBehavior === "fill" ? "min-w-full" : "min-w-full w-max",
            "caption-bottom border-separate border-spacing-0 text-sm",
            className
          )}
          style={{
            ...(widthBehavior === "fill"
              ? {
                  width: hasControlledColumnWidths
                    ? `max(100%, ${resolvedColumnWidthSum}px)`
                    : "100%",
                }
              : {}),
            ...style,
          }}
          {...props}
        />
      </div>
    </TableContext.Provider>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "[&_tr]:border-b [&_tr]:border-border [&_tr]:bg-muted",
        "[&:has(th[colspan],th[rowspan])_th]:border-b [&:has(th[colspan],th[rowspan])_th]:border-border",
        className
      )}
      {...props}
    />
  )
}

function TableBody({
  className,
  showRowBorders = true,
  ...props
}: React.ComponentProps<"tbody"> & {
  showRowBorders?: boolean
}) {
  const { zebra } = useTableContext()

  return (
    <tbody
      data-slot="table-body"
      data-zebra={zebra || undefined}
      data-row-borders={showRowBorders || undefined}
      className={cn(
        "[&_tr:hover]:bg-muted",
        showRowBorders && "[&_td]:border-b [&_td]:border-border [&_tr:last-child>td]:border-b-0",
        zebra &&
          "[&_tr:nth-child(even)]:bg-muted/20 [&_tr:nth-child(even):hover]:bg-muted",
        className
      )}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-border bg-background font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "group/table-row bg-transparent transition-colors",
        className
      )}
      {...props}
    />
  )
}

function TableHead({
  className,
  columnId,
  minWidth,
  maxWidth,
  measureWidth,
  resizable: resizableOverride,
  children,
  style,
  ...props
}: React.ComponentProps<"th"> & TableColumnProps) {
  const { size, stickyHeader, resizable, showColumnBorders, columnWidths, setColumnWidth, setColumnWidths } = useTableContext()
  const activeResizable = Boolean((resizableOverride ?? resizable) && columnId)
  const resolvedMinWidth = minWidth ?? 72
  const resolvedWidth = columnId ? columnWidths[columnId] : undefined

  if (process.env.NODE_ENV !== "production" && !columnId && !props.colSpan) {
    throw new Error(
      "TableHead requires a columnId for default table behaviors. Use a wrapper with a stable columnId or mark grouped headers with colSpan."
    )
  }

  const handleResizeStart = React.useCallback(
    (event: React.PointerEvent<HTMLSpanElement>) => {
      if (!activeResizable || !columnId) return

      event.preventDefault()
      event.stopPropagation()

      const headerCell = event.currentTarget.parentElement
      const headerRow = headerCell?.parentElement
      const frozenColumnWidths = Array.from(headerRow?.children ?? []).reduce<TableColumnWidthMap>(
        (widths, cell) => {
          const element = cell as HTMLElement
          const currentColumnId = element.dataset.columnId

          if (!currentColumnId) return widths

          widths[currentColumnId] = element.getBoundingClientRect().width
          return widths
        },
        {}
      )

      if (Object.keys(frozenColumnWidths).length > 0) {
        setColumnWidths((current) => ({ ...frozenColumnWidths, ...current }))
      }

      const headerWidth = headerCell?.getBoundingClientRect().width ?? resolvedMinWidth
      const startX = event.clientX
      const startWidth = frozenColumnWidths[columnId] ?? resolvedWidth ?? headerWidth

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const nextWidth = startWidth + (moveEvent.clientX - startX)
        const clampedWidth = Math.max(
          resolvedMinWidth,
          maxWidth ? Math.min(maxWidth, nextWidth) : nextWidth
        )
        setColumnWidth(columnId, clampedWidth)
      }

      const handlePointerUp = () => {
        window.removeEventListener("pointermove", handlePointerMove)
        window.removeEventListener("pointerup", handlePointerUp)
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
      }

      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
      window.addEventListener("pointermove", handlePointerMove)
      window.addEventListener("pointerup", handlePointerUp)
    },
    [
      activeResizable,
      columnId,
      maxWidth,
      resolvedMinWidth,
      resolvedWidth,
      setColumnWidth,
      setColumnWidths,
    ]
  )

  return (
    <th
      data-slot="table-head"
      className={cn(
        "border-b border-border text-foreground/80 text-left align-middle font-medium whitespace-nowrap overflow-hidden [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        showColumnBorders && "[&:not(:last-child)]:border-r [&:not(:last-child)]:border-border",
        tableSizeStyles[size].head,
        stickyHeader &&
          "sticky top-0 z-10 bg-muted/95 supports-[backdrop-filter]:bg-muted/85 backdrop-blur",
        activeResizable && "relative",
        className
      )}
      style={{
        ...(resolvedWidth ? { width: resolvedWidth, minWidth: resolvedWidth } : {}),
        ...(minWidth ? { minWidth } : {}),
        ...(maxWidth ? { maxWidth } : {}),
        ...style,
      }}
      data-column-id={columnId}
      data-min-width={minWidth}
      data-overflow-basis={measureWidth ?? minWidth}
      {...props}
    >
      {children}
      {activeResizable ? (
        <span
          role="separator"
          aria-orientation="vertical"
          aria-label={`Resize ${columnId} column`}
          data-slot="table-column-resize-handle"
          className="absolute top-0 right-0 z-[5] h-full w-3 cursor-col-resize touch-none select-none"
          onPointerDown={handleResizeStart}
        >
          {showColumnBorders ? null : (
            <span className="pointer-events-none absolute top-1/2 right-1 h-5 w-px -translate-y-1/2 bg-border transition-colors hover:bg-primary" />
          )}
        </span>
      ) : null}
    </th>
  )
}

function TableCell({
  className,
  columnId,
  minWidth,
  maxWidth,
  measureWidth,
  style,
  ...props
}: React.ComponentProps<"td"> & TableColumnProps) {
  const { size, showColumnBorders, columnWidths } = useTableContext()
  const resolvedWidth = columnId ? columnWidths[columnId] : undefined

  return (
    <td
      data-slot="table-cell"
      className={cn(
        "align-middle whitespace-nowrap overflow-hidden [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        showColumnBorders && "[&:not(:last-child)]:border-r [&:not(:last-child)]:border-border",
        tableSizeStyles[size].cell,
        className
      )}
      style={{
        ...(resolvedWidth ? { width: resolvedWidth, minWidth: resolvedWidth } : {}),
        ...(minWidth ? { minWidth } : {}),
        ...(maxWidth ? { maxWidth } : {}),
        ...style,
      }}
      data-column-id={columnId}
      data-min-width={minWidth}
      data-overflow-basis={measureWidth ?? minWidth}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

function TableCellContent({
  className,
  align = "start",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  align?: "start" | "center" | "end"
}) {
  const { size } = useTableContext()

  return (
    <div
      data-slot="table-cell-content"
      data-align={align}
      className={cn(
        "flex min-w-0 items-center",
        tableSizeStyles[size].fieldGap,
        align === "center" && "justify-center text-center",
        align === "end" && "justify-end text-right",
        className
      )}
      {...props}
    />
  )
}

function TableCellText({
  className,
  primary,
  secondary,
  align = "start",
  emphasis = "default",
  numeric = false,
  mono = false,
  truncate = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  primary: React.ReactNode
  secondary?: React.ReactNode
  align?: "start" | "center" | "end"
  emphasis?: "default" | "strong" | "muted"
  numeric?: boolean
  mono?: boolean
  truncate?: boolean
}) {
  const { size } = useTableContext()

  return (
    <div
      data-slot="table-cell-text"
      data-align={align}
      className={cn(
        "grid min-w-0 gap-0.5",
        align === "center" && "justify-items-center text-center",
        align === "end" && "justify-items-end text-right",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "min-w-0 leading-5 text-foreground",
          tableSizeStyles[size].title,
          emphasis === "strong" && "font-medium",
          emphasis === "muted" && "text-muted-foreground",
          numeric && "tabular-nums",
          mono && "font-mono",
          truncate && "truncate"
        )}
      >
        {primary}
      </span>
      {secondary ? (
        <span
          className={cn(
            "min-w-0 leading-4 text-muted-foreground",
            tableSizeStyles[size].supporting,
            numeric && "tabular-nums",
            truncate && "truncate"
          )}
        >
          {secondary}
        </span>
      ) : null}
    </div>
  )
}

function formatTableNumber(
  value: number,
  format: TableNumberFormat,
  {
    currency = "USD",
    maximumFractionDigits,
    minimumFractionDigits,
  }: {
    currency?: string
    maximumFractionDigits?: number
    minimumFractionDigits?: number
  } = {}
) {
  const options: Intl.NumberFormatOptions =
    format === "currency"
      ? {
          style: "currency",
          currency,
          maximumFractionDigits: maximumFractionDigits ?? 0,
          minimumFractionDigits: minimumFractionDigits ?? 0,
        }
      : format === "percent"
        ? {
            style: "percent",
            maximumFractionDigits: maximumFractionDigits ?? 1,
            minimumFractionDigits: minimumFractionDigits ?? 1,
          }
        : {
            maximumFractionDigits:
              maximumFractionDigits ?? (format === "integer" ? 0 : 1),
            minimumFractionDigits:
              minimumFractionDigits ?? (format === "integer" ? 0 : 0),
          }

  return new Intl.NumberFormat("en-US", options).format(
    format === "percent" ? value / 100 : value
  )
}

function TableCellNumber({
  value,
  secondary,
  align = "end",
  format = "decimal",
  currency = "USD",
  maximumFractionDigits,
  minimumFractionDigits,
  emphasis = "strong",
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  value: number
  secondary?: React.ReactNode
  align?: "start" | "center" | "end"
  format?: TableNumberFormat
  currency?: string
  maximumFractionDigits?: number
  minimumFractionDigits?: number
  emphasis?: "default" | "strong" | "muted"
}) {
  return (
    <TableCellText
      primary={formatTableNumber(value, format, {
        currency,
        maximumFractionDigits,
        minimumFractionDigits,
      })}
      secondary={secondary}
      align={align}
      emphasis={emphasis}
      numeric
      className={className}
      {...props}
    />
  )
}

function TableCellDateTime({
  value,
  secondary,
  align = "start",
  dateStyle = "medium",
  timeStyle = "short",
  locale = "en-US",
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  value: string | number | Date
  secondary?: React.ReactNode
  align?: "start" | "center" | "end"
  dateStyle?: "full" | "long" | "medium" | "short"
  timeStyle?: "full" | "long" | "medium" | "short" | undefined
  locale?: string
}) {
  const date = value instanceof Date ? value : new Date(value)

  return (
    <TableCellText
      primary={new Intl.DateTimeFormat(locale, { dateStyle, timeStyle }).format(date)}
      secondary={secondary}
      align={align}
      className={className}
      {...props}
    />
  )
}

function TableCellLink({
  href,
  primary,
  secondary,
  external = false,
  align = "start",
  className,
  ...props
}: Omit<React.ComponentProps<"a">, "children"> & {
  href: string
  primary: React.ReactNode
  secondary?: React.ReactNode
  external?: boolean
  align?: "start" | "center" | "end"
}) {
  const { size } = useTableContext()

  return (
    <div
      data-slot="table-cell-link"
      className={cn(
        "grid min-w-0 gap-0.5",
        align === "center" && "justify-items-center text-center",
        align === "end" && "justify-items-end text-right",
        className
      )}
    >
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
        className={cn(
          "min-w-0 truncate text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline",
          tableSizeStyles[size].title
        )}
        {...props}
      >
        {primary}
      </a>
      {secondary ? (
        <span className={cn("truncate text-muted-foreground", tableSizeStyles[size].supporting)}>
          {secondary}
        </span>
      ) : null}
    </div>
  )
}

function TableCellTagList({
  items,
  max = 3,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  items: React.ReactNode[]
  max?: number
}) {
  const visibleItems = items.slice(0, max)
  const remainingCount = Math.max(items.length - visibleItems.length, 0)

  return (
    <TableCellContent className={cn("flex-wrap gap-1.5", className)} {...props}>
      {visibleItems.map((item, index) => (
        <TableCellBadge key={`${String(item)}-${index}`} variant="secondary">
          {item}
        </TableCellBadge>
      ))}
      {remainingCount ? (
        <TableCellBadge variant="outline">+{remainingCount}</TableCellBadge>
      ) : null}
    </TableCellContent>
  )
}

function TableCellEmpty({
  label = "--",
  align = "start",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  label?: React.ReactNode
  align?: "start" | "center" | "end"
}) {
  return (
    <span
      data-slot="table-cell-empty"
      className={cn(
        "inline-flex text-muted-foreground/80",
        align === "center" && "justify-center text-center",
        align === "end" && "ml-auto justify-end text-right",
        className
      )}
      {...props}
    >
      {label}
    </span>
  )
}

function TableCellAvatar({
  className,
  src,
  alt,
  fallback,
  primary,
  secondary,
  meta,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  src?: string
  alt?: string
  fallback: string
  primary: React.ReactNode
  secondary?: React.ReactNode
  meta?: React.ReactNode
}) {
  const { size } = useTableContext()

  return (
    <TableCellContent className={className} {...props}>
      <Avatar size={tableSizeStyles[size].avatar}>
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      <div className="grid min-w-0 gap-0.5">
        <span className={cn("truncate text-foreground", tableSizeStyles[size].title)}>
          {primary}
        </span>
        {secondary ? (
          <span className={cn("truncate text-muted-foreground", tableSizeStyles[size].supporting)}>
            {secondary}
          </span>
        ) : null}
      </div>
      {meta ? (
        <span
          className={cn(
            "ml-auto shrink-0 text-muted-foreground tabular-nums",
            tableSizeStyles[size].supporting
          )}
        >
          {meta}
        </span>
      ) : null}
    </TableCellContent>
  )
}

function TableCellImage({
  className,
  src,
  alt,
  primary,
  secondary,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  src: string
  alt: string
  primary: React.ReactNode
  secondary?: React.ReactNode
}) {
  const { size } = useTableContext()

  return (
    <TableCellContent className={className} {...props}>
      <div
        className={cn(
          "overflow-hidden rounded-[calc(var(--radius)-2px)] border border-border bg-muted/30",
          tableSizeStyles[size].image
        )}
      >
        <img src={src} alt={alt} className="size-full object-cover" />
      </div>
      <TableCellText primary={primary} secondary={secondary} truncate />
    </TableCellContent>
  )
}

function TableCellBadge({
  className,
  children,
  variant = "secondary",
  ...props
}: React.ComponentProps<typeof Badge> & {
  variant?: React.ComponentProps<typeof Badge>["variant"]
}) {
  return (
    <Badge
      className={cn("max-w-full truncate", className)}
      variant={variant}
      {...props}
    >
      {children}
    </Badge>
  )
}

function TableCellStatus({
  className,
  label,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  label: React.ReactNode
  tone?: TableTone
}) {
  const { size } = useTableContext()
  const toneStyle = tableToneStyles[tone]

  return (
    <span
      data-slot="table-cell-status"
      className={cn(
        "inline-flex max-w-full min-w-0 items-center gap-2 overflow-hidden font-medium",
        tableSizeStyles[size].title,
        toneStyle.text,
        className
      )}
      {...props}
    >
      <span className={cn("size-2 rounded-full", toneStyle.dot)} />
      <span className="truncate">{label}</span>
    </span>
  )
}

function TableCellDelta({
  className,
  value,
  suffix = "%",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  value: number
  suffix?: string
}) {
  const tone: TableTone = value > 0 ? "success" : value < 0 ? "destructive" : "neutral"
  const toneStyle = tableToneStyles[tone]

  return (
    <span
      data-slot="table-cell-delta"
      className={cn("inline-flex items-center font-medium tabular-nums", toneStyle.text, className)}
      {...props}
    >
      {value > 0 ? "+" : ""}
      {value.toFixed(1)}
      {suffix}
    </span>
  )
}

function TableCellProgress({
  className,
  value,
  tone = "info",
  label,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  value: number
  tone?: TableTone
  label?: React.ReactNode
}) {
  const { size } = useTableContext()
  const toneStyle = tableToneStyles[tone]

  return (
    <div
      data-slot="table-cell-progress"
      className={cn("grid min-w-0 gap-1", className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        {label ? (
          <span className={cn("truncate text-muted-foreground", tableSizeStyles[size].supporting)}>
            {label}
          </span>
        ) : null}
        <span className={cn("shrink-0 tabular-nums", tableSizeStyles[size].supporting)}>
          {value}%
        </span>
      </div>
      <Progress
        value={value}
        className={cn("h-1.5", toneStyle.track)}
        indicatorClassName={toneStyle.indicator}
      />
    </div>
  )
}

function TableCellActions({
  className,
  align = "end",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  align?: "start" | "center" | "end"
}) {
  return (
    <TableCellContent
      data-slot="table-cell-actions"
      align={align}
      className={cn(
        "gap-0",
        "[&>*]:shrink-0",
        "[&>*+*]:relative [&>*+*]:ml-6",
        "[&>*+*]:before:absolute [&>*+*]:before:top-1/2 [&>*+*]:before:left-[-0.75rem] [&>*+*]:before:h-5 [&>*+*]:before:w-px [&>*+*]:before:-translate-y-1/2 [&>*+*]:before:bg-border",
        "[&>[data-slot=button][data-variant=link]]:h-auto [&>[data-slot=button][data-variant=link]]:rounded-none [&>[data-slot=button][data-variant=link]]:p-0",
        "[&>[data-slot=button][data-size=icon-xs]]:size-5 [&>[data-slot=button][data-size=icon-xs]]:rounded-md",
        "[&>[data-slot=button][data-size=icon-sm]]:size-6 [&>[data-slot=button][data-size=icon-sm]]:rounded-md",
        "[&>[data-slot=button][data-size=icon]]:size-7 [&>[data-slot=button][data-size=icon]]:rounded-md",
        className
      )}
      {...props}
    />
  )
}

function TableCellCheckbox({
  className,
  ...props
}: React.ComponentProps<typeof Checkbox>) {
  const { size } = useTableContext()

  return (
    <Checkbox className={cn(tableSizeStyles[size].checkbox, className)} {...props} />
  )
}

function getNextTableSortDirection(
  direction: TableSortDirection,
  allowClear = true
): Exclude<TableSortDirection, "none"> | "none" {
  if (direction === "none") return "asc"
  if (direction === "asc") return "desc"
  return allowClear ? "none" : "asc"
}

type TableHeadSortButtonProps =
  React.ComponentProps<"button"> & {
    direction?: TableSortDirection
    align?: "start" | "end"
    allowClear?: boolean
    onDirectionChange?: (direction: TableSortDirection) => void
  }

function TableHeadSortButton({
  className,
  direction = "none",
  align = "start",
  allowClear = true,
  onDirectionChange,
  ...props
}: TableHeadSortButtonProps) {
  if (process.env.NODE_ENV !== "production" && !onDirectionChange && !props.onClick) {
    throw new Error(
      "TableHeadSortButton requires a real sorting handler via onDirectionChange or onClick. Use plain text headers when sorting is not implemented."
    )
  }

  const icon =
    direction === "asc" ? (
      <ArrowUpIcon className="size-3" />
    ) : direction === "desc" ? (
      <ArrowDownIcon className="size-3" />
    ) : (
      <ArrowUpDownIcon className="size-3 opacity-50" />
    )

  return (
    <button
      type="button"
      data-slot="table-head-sort-button"
      data-direction={direction}
      aria-sort={direction === "none" ? "none" : direction === "asc" ? "ascending" : "descending"}
      className={cn(
        "inline-flex max-w-full min-w-0 items-center gap-1 overflow-hidden text-inherit transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground data-[direction=asc]:text-foreground data-[direction=desc]:text-foreground",
        align === "end" && "ml-auto",
        className
      )}
      onClick={(event) => {
        props.onClick?.(event)
        if (!event.defaultPrevented && onDirectionChange) {
          onDirectionChange(getNextTableSortDirection(direction, allowClear))
        }
      }}
      {...props}
    >
      <span className="truncate">{props.children}</span>
      {icon}
    </button>
  )
}

function TableActionHead({
  className,
  shadow = true,
  minWidth,
  measureWidth,
  columnId = "actions",
  ...props
}: React.ComponentProps<"th"> &
  TableColumnProps & {
    shadow?: boolean
  }) {
  const { stickyHeader, hasHorizontalOverflow, hasActionColumn } = useTableContext()
  const shouldStick = hasActionColumn && hasHorizontalOverflow
  const resolvedMeasureWidth = measureWidth ?? minWidth ?? 92

  return (
    <TableHead
      columnId={columnId}
      resizable={false}
      minWidth={undefined}
      className={cn(
        "text-right",
        !shouldStick && "w-px min-w-max",
        shouldStick && "w-0 min-w-max bg-muted",
        shouldStick && "after:bg-muted",
        shouldStick && getActionStickyStyles(shadow),
        stickyHeader && shouldStick && "z-20",
        className
      )}
      data-slot="table-action-head"
      measureWidth={resolvedMeasureWidth}
      {...props}
    />
  )
}

function TableActionCell({
  className,
  shadow = true,
  minWidth,
  measureWidth,
  ...props
}: React.ComponentProps<"td"> &
  TableColumnProps & {
    shadow?: boolean
  }) {
  const { hasHorizontalOverflow, hasActionColumn } = useTableContext()
  const shouldStick = hasActionColumn && hasHorizontalOverflow
  const resolvedMeasureWidth = measureWidth ?? minWidth ?? 92

  return (
    <TableCell
      minWidth={undefined}
      className={cn(
        "text-right",
        !shouldStick && "w-px min-w-max",
        shouldStick && "w-0 min-w-max bg-background group-hover/table-row:bg-muted",
        shouldStick && "after:bg-background",
        shouldStick && getActionStickyStyles(shadow),
        className
      )}
      data-slot="table-action-cell"
      measureWidth={resolvedMeasureWidth}
      {...props}
    />
  )
}

function TableSelectionHead({
  className,
  children,
  showDivider = true,
  columnId = "selection",
  ...props
}: React.ComponentProps<"th"> &
  TableColumnProps & {
    showDivider?: boolean
  }) {
  return (
    <TableHead
      columnId={columnId}
      className={cn(
        "w-12 min-w-12 px-0 text-center",
        !showDivider && "!border-r-0",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center">{children}</div>
    </TableHead>
  )
}

function TableSelectionCell({
  className,
  children,
  showDivider = true,
  ...props
}: React.ComponentProps<"td"> &
  TableColumnProps & {
    showDivider?: boolean
  }) {
  return (
    <TableCell
      className={cn(
        "w-12 min-w-12 px-0 text-center",
        !showDivider && "!border-r-0",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center">{children}</div>
    </TableCell>
  )
}

function TablePinnedHead({
  className,
  shadow = true,
  minWidth,
  measureWidth,
  columnId,
  ...props
}: React.ComponentProps<"th"> &
  TableColumnProps & {
    shadow?: boolean
  }) {
  const { stickyHeader } = useTableContext()
  const shouldStick = true
  const resolvedMeasureWidth = measureWidth ?? minWidth

  return (
    <TableHead
      columnId={columnId ?? "pinned"}
      className={cn(
        shouldStick && "bg-muted",
        shouldStick && getPinnedLeftStickyStyles(shadow),
        stickyHeader && shouldStick && "z-20",
        className
      )}
      minWidth={minWidth}
      measureWidth={resolvedMeasureWidth}
      {...props}
    />
  )
}

function TablePinnedCell({
  className,
  shadow = true,
  minWidth,
  measureWidth,
  ...props
}: React.ComponentProps<"td"> &
  TableColumnProps & {
    shadow?: boolean
  }) {
  const shouldStick = true
  const resolvedMeasureWidth = measureWidth ?? minWidth

  return (
    <TableCell
      className={cn(
        shouldStick && "bg-background group-hover/table-row:bg-muted",
        shouldStick && getPinnedLeftStickyStyles(shadow),
        className
      )}
      minWidth={minWidth}
      measureWidth={resolvedMeasureWidth}
      {...props}
    />
  )
}

export {
  TableSurface,
  TableFooterBar,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableCellContent,
  TableCellText,
  TableCellNumber,
  TableCellDateTime,
  TableCellLink,
  TableCellAvatar,
  TableCellImage,
  TableCellBadge,
  TableCellTagList,
  TableCellEmpty,
  TableCellStatus,
  TableCellDelta,
  TableCellProgress,
  TableCellActions,
  TableCellCheckbox,
  getNextTableSortDirection,
  TableHeadSortButton,
  TableActionHead,
  TableActionCell,
  TablePinnedHead,
  TablePinnedCell,
  TableSelectionHead,
  TableSelectionCell,
}

export type {
  TableProps,
  TableSize,
  TableTone,
  TableSortDirection,
  TableNumberFormat,
}
