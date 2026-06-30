import * as React from "react"

import { cn } from "@/lib/utils"

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  invalid?: boolean
  orientation?: "vertical" | "horizontal"
}

function Field({
  className,
  invalid,
  orientation = "vertical",
  ...props
}: FieldProps) {
  return (
    <div
      data-slot="field"
      data-invalid={invalid || undefined}
      data-orientation={orientation}
      className={cn(
        "group/field flex gap-1.5 data-[orientation=horizontal]:items-center data-[orientation=horizontal]:gap-3 data-[orientation=horizontal]:has-[>[data-slot=field-content]]:items-start",
        orientation === "vertical" ? "flex-col" : "flex-row",
        className
      )}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="field-group"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="field-content"
      className={cn("grid min-w-0 gap-1.5", className)}
      {...props}
    />
  )
}

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn("grid gap-3 border-0 p-0 m-0 min-w-0", className)}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "default" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      className={cn(
        variant === "label"
          ? "text-sm font-medium leading-none text-foreground"
          : "text-base font-semibold leading-6 text-foreground",
        className
      )}
      {...props}
    />
  )
}

interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

function FieldLabel({ className, required, children, ...props }: FieldLabelProps) {
  return (
    <label
      data-slot="field-label"
      className={cn(
        "text-sm font-medium leading-5 text-foreground group-data-[invalid]/field:text-destructive group-data-[disabled]/field:pointer-events-none group-data-[disabled]/field:text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      {required ? <span className="ml-0.5 text-destructive">*</span> : null}
    </label>
  )
}

function FieldTitle({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="field-title"
      className={cn("text-sm font-medium leading-5 text-foreground", className)}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-xs leading-5 text-muted-foreground", className)}
      {...props}
    />
  )
}

function FieldError({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="field-error"
      role="alert"
      className={cn("text-xs leading-5 text-destructive", className)}
      {...props}
    />
  )
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
}
export type { FieldProps, FieldLabelProps }
