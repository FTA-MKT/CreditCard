import * as React from "react"

import { cn } from "@/lib/utils"

const INPUT_TYPES = ["text", "email", "number", "search", "date"] as const

function Input({
  className,
  type,
  size = "default",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & {
  size?: "sm" | "default" | "lg"
}) {
  return (
    <input
      type={type}
      data-slot="input"
      data-size={size}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground/90 selection:bg-primary selection:text-primary-foreground border-input w-full min-w-0 rounded-[var(--radius)] border bg-background px-3 py-1 text-sm transition-[color,box-shadow,border-color,background-color] outline-none hover:border-ring/40 dark:bg-input/30 file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "data-[size=sm]:h-8 data-[size=default]:h-9 data-[size=lg]:h-10",
        "data-[size=sm]:text-xs data-[size=default]:text-sm data-[size=lg]:text-base",
        "data-[size=sm]:file:h-6 data-[size=default]:file:h-7 data-[size=lg]:file:h-8",
        "focus-visible:border-ring",
        "disabled:border-border disabled:bg-muted/60 disabled:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-100",
        "aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input, INPUT_TYPES }
