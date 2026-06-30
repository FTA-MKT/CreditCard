import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const kbdVariants = cva(
  "inline-flex items-center justify-center font-mono text-muted-foreground select-none",
  {
    variants: {
      size: {
        sm: "h-5 min-w-5 rounded-[calc(var(--radius)-4px)] px-1 text-[10px] border border-border shadow-[0_1px_0_0_hsl(var(--border))]",
        default: "h-6 min-w-6 rounded-[calc(var(--radius)-2px)] px-1.5 text-xs border border-border shadow-[0_2px_0_0_hsl(var(--border))]",
        lg: "h-7 min-w-7 rounded-[var(--radius)] px-2 text-sm border border-border shadow-[0_2px_0_0_hsl(var(--border))]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {}

function Kbd({ className, size, children, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(kbdVariants({ size }), className)}
      {...props}
    >
      {children}
    </kbd>
  )
}

export { Kbd, kbdVariants }
