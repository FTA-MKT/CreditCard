import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full rounded-[var(--radius)] border bg-background px-3 py-2 text-base transition-[color,box-shadow,border-color,background-color] outline-none hover:border-ring/40 focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring disabled:border-border disabled:bg-muted/60 disabled:text-muted-foreground disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-100 aria-invalid:border-destructive md:text-sm dark:bg-input/30",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
