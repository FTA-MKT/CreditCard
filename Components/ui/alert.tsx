import * as React from "react"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const ALERT_TONES = [
  "default",
  "destructive",
  "success",
  "warning",
  "info",
] as const

// ── Variants ──────────────────────────────────────────────────────────────────
const alertVariants = cva(
  "relative w-full rounded-xl border px-4 py-3 text-sm",
  {
    variants: {
      variant: {
        default: "border-primary/15 bg-primary/5 text-foreground",
        destructive: "border-destructive/20 bg-destructive/10 text-destructive",
        success: "border-success/20 bg-success/10 text-success",
        warning: "border-warning/20 bg-warning/10 text-warning",
        info: "border-info/20 bg-info/10 text-info",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

// ── Alert ─────────────────────────────────────────────────────────────────────
function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

// ── AlertHeader — icon + title + action/close on one row ──────────────────────
// Use this wrapper when you want icon, title, and action/close on the same line.
// Optional: use Alert directly without AlertHeader for the simple case.
function AlertHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-header"
      className={cn(
        "flex items-start gap-3 [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:self-start",
        className
      )}
      {...props}
    />
  )
}

// ── AlertTitle ────────────────────────────────────────────────────────────────
function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("flex-1 text-sm font-medium leading-5 tracking-tight", className)}
      {...props}
    />
  )
}

// ── AlertDescription ──────────────────────────────────────────────────────────
function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "mt-1 text-sm leading-6 opacity-90 [&_p]:leading-6",
        className
      )}
      {...props}
    />
  )
}

// ── AlertAction — text/button slot, right-aligned in AlertHeader ──────────────
function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("shrink-0 self-start", className)}
      {...props}
    />
  )
}

// ── AlertCloseButton ──────────────────────────────────────────────────────────
function AlertCloseButton({
  className,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      data-slot="alert-close"
      aria-label="Dismiss"
      onClick={onClick}
      className={cn(
        "ml-1 shrink-0 rounded-sm p-0.5 opacity-60 transition-colors transition-opacity hover:bg-foreground/5 hover:opacity-100",
        className
      )}
      {...props}
    >
      <X className="h-4 w-4" />
    </button>
  )
}

export {
  Alert,
  AlertHeader,
  AlertTitle,
  AlertDescription,
  AlertAction,
  AlertCloseButton,
  alertVariants,
  ALERT_TONES,
}
