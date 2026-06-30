import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { buttonVariants, type Button } from "@/components/ui/button"

type PaginationSize = "sm" | "md" | "lg"
type PaginationButtonSize = React.ComponentProps<typeof Button>["size"]

const paginationSizeStyles: Record<
  PaginationSize,
  {
    nav: string
    content: string
    item: React.ComponentProps<typeof Button>["size"]
    control: React.ComponentProps<typeof Button>["size"]
    controlPadding: string
    ellipsis: string
    label: string
    pageSize: string
  }
> = {
  sm: {
    nav: "",
    content: "gap-0.5",
    item: "icon-xs",
    control: "xs",
    controlPadding: "px-2",
    ellipsis: "size-6 text-xs",
    label: "text-[11px] leading-none",
    pageSize: "h-6 min-w-[6.5rem] rounded-lg px-2 text-[11px]",
  },
  md: {
    nav: "",
    content: "gap-1",
    item: "icon",
    control: "default",
    controlPadding: "px-2.5",
    ellipsis: "size-9 text-sm",
    label: "text-xs leading-none",
    pageSize: "h-9 min-w-[7rem] text-sm",
  },
  lg: {
    nav: "",
    content: "gap-1.5",
    item: "icon-lg",
    control: "lg",
    controlPadding: "px-3",
    ellipsis: "size-10 text-sm",
    label: "text-sm leading-none",
    pageSize: "h-10 min-w-[7.5rem] text-sm",
  },
}

function Pagination({
  className,
  size = "md",
  ...props
}: React.ComponentProps<"nav"> & { size?: PaginationSize }) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      data-size={size}
      className={cn("mx-auto flex w-full justify-center", paginationSizeStyles[size].nav, className)}
      {...props}
    />
  )
}

function PaginationContent({
  size = "md",
  className,
  ...props
}: React.ComponentProps<"ul"> & { size?: PaginationSize }) {
  return (
    <ul
      data-slot="pagination-content"
      data-size={size}
      className={cn("flex flex-row items-center", paginationSizeStyles[size].content, className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" className="flex items-center" {...props} />
}

function isPaginationScale(value: string): value is PaginationSize {
  return value === "sm" || value === "md" || value === "lg"
}

function resolvePaginationSize(value?: PaginationSize | PaginationButtonSize | null): PaginationSize {
  return value && isPaginationScale(value) ? value : "md"
}

type PaginationLinkProps = {
  isActive?: boolean
  size?: PaginationSize | PaginationButtonSize
  paginationSize?: PaginationSize
} & React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size,
  paginationSize,
  buttonSize,
  ...props
}: PaginationLinkProps & {
  buttonSize?: React.ComponentProps<typeof Button>["size"]
}) {
  const resolvedPaginationSize = paginationSize ?? resolvePaginationSize(size)
  const resolvedButtonSize =
    buttonSize ?? (size && !isPaginationScale(size) ? size : paginationSizeStyles[resolvedPaginationSize].item)

  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      data-size={resolvedPaginationSize}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size: resolvedButtonSize,
        }),
        paginationSizeStyles[resolvedPaginationSize].label,
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  size = "md",
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  const resolvedPaginationSize = resolvePaginationSize(size)

  return (
    <PaginationLink
      aria-label="Go to previous page"
      paginationSize={resolvedPaginationSize}
      buttonSize={paginationSizeStyles[resolvedPaginationSize].control}
      className={cn(
        "gap-1",
        paginationSizeStyles[resolvedPaginationSize].controlPadding,
        paginationSizeStyles[resolvedPaginationSize].label,
        className
      )}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  )
}

function PaginationNext({
  size = "md",
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  const resolvedPaginationSize = resolvePaginationSize(size)

  return (
    <PaginationLink
      aria-label="Go to next page"
      paginationSize={resolvedPaginationSize}
      buttonSize={paginationSizeStyles[resolvedPaginationSize].control}
      className={cn(
        "gap-1",
        paginationSizeStyles[resolvedPaginationSize].controlPadding,
        paginationSizeStyles[resolvedPaginationSize].label,
        className
      )}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  size = "md",
  className,
  ...props
}: React.ComponentProps<"span"> & { size?: PaginationSize }) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      data-size={size}
      className={cn("flex items-center justify-center", paginationSizeStyles[size].ellipsis, className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

function PaginationPageSize({
  size = "md",
  value,
  onValueChange,
  options,
  formatLabel,
  className,
}: {
  size?: PaginationSize
  value: string
  onValueChange: (value: string) => void
  options: Array<string | number>
  formatLabel?: (value: string) => React.ReactNode
  className?: string
}) {
  const resolvedValue = String(value)
  const resolvedOptions = React.useMemo(() => options.map((option) => String(option)), [options])
  const normalizedValue = resolvedOptions.includes(resolvedValue)
    ? resolvedValue
    : (resolvedOptions[0] ?? resolvedValue)
  const mismatchKeyRef = React.useRef<string | null>(null)
  const mismatchKey =
    resolvedOptions.length > 0 && !resolvedOptions.includes(resolvedValue)
      ? `${resolvedValue}::${resolvedOptions.join("|")}`
      : null

  React.useEffect(() => {
    if (resolvedOptions.length === 0) return
    if (resolvedOptions.includes(resolvedValue)) {
      mismatchKeyRef.current = null
      return
    }
    if (mismatchKeyRef.current === mismatchKey) return
    mismatchKeyRef.current = mismatchKey
    onValueChange(normalizedValue)
  }, [mismatchKey, normalizedValue, onValueChange, resolvedOptions, resolvedValue])

  return (
    <Select value={normalizedValue} onValueChange={onValueChange}>
      <SelectTrigger
        size={size === "sm" ? "sm" : "default"}
        className={cn("w-auto shrink-0", paginationSizeStyles[size].pageSize, className)}
      >
        <SelectValue>{formatLabel ? formatLabel(normalizedValue) : `${normalizedValue} / page`}</SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {resolvedOptions.map((optionValue) => {

          return (
            <SelectItem key={optionValue} value={optionValue}>
              {formatLabel ? formatLabel(optionValue) : `${optionValue} / page`}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationPageSize,
}

export type { PaginationSize }
