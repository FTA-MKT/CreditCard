import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonGroupVariants = cva("inline-flex items-stretch", {
  variants: {
    orientation: {
      horizontal: [
        "flex-row",
        "[&>button:not(:first-child)]:-ml-px",
        "[&>button]:rounded-none",
        "[&>button:first-child]:rounded-l-lg",
        "[&>button:last-child]:rounded-r-lg",
        "[&>button:focus-visible]:relative",
        "[&>button:focus-visible]:z-10",
        "[&>[data-slot=button]:not(:first-child)]:-ml-px",
        "[&>[data-slot=button]:rounded-none]",
        "[&>[data-slot=button]:first-child]:rounded-l-lg",
        "[&>[data-slot=button]:last-child]:rounded-r-lg",
        "[&>[data-slot=button]:focus-visible]:relative",
        "[&>[data-slot=button]:focus-visible]:z-10",
        "[&>[data-slot=dropdown-menu-trigger]:not(:first-child)]:-ml-px",
        "[&>[data-slot=dropdown-menu-trigger]:rounded-none]",
        "[&>[data-slot=dropdown-menu-trigger]:first-child]:rounded-l-lg",
        "[&>[data-slot=dropdown-menu-trigger]:last-child]:rounded-r-lg",
        "[&>[data-slot=popover-trigger]:not(:first-child)]:-ml-px",
        "[&>[data-slot=popover-trigger]:rounded-none]",
        "[&>[data-slot=popover-trigger]:first-child]:rounded-l-lg",
        "[&>[data-slot=popover-trigger]:last-child]:rounded-r-lg",
        "[&>[data-slot=input-group]:not(:first-child)]:-ml-px",
        "[&>[data-slot=input-group]]:[&_[data-slot=input]]:rounded-none",
        "[&>[data-slot=input-group]:first-child]:[&_[data-slot=input]]:rounded-l-lg",
        "[&>[data-slot=input-group]:last-child]:[&_[data-slot=input]]:rounded-r-lg",
        "[&>[data-slot=input-group]:focus-within]:relative",
        "[&>[data-slot=input-group]:focus-within]:z-10",
        "[&>[data-slot=input]:not(:first-child)]:-ml-px",
        "[&>[data-slot=input]:rounded-none]",
        "[&>[data-slot=input]:first-child]:rounded-l-lg",
        "[&>[data-slot=input]:last-child]:rounded-r-lg",
        "[&>[data-slot=input]:focus-visible]:relative",
        "[&>[data-slot=input]:focus-visible]:z-10",
        "[&>[data-slot=select-trigger]:not(:first-child)]:-ml-px",
        "[&>[data-slot=select-trigger]:rounded-none]",
        "[&>[data-slot=select-trigger]:first-child]:rounded-l-lg",
        "[&>[data-slot=select-trigger]:last-child]:rounded-r-lg",
        "[&>[data-slot=select-trigger]:focus-visible]:relative",
        "[&>[data-slot=select-trigger]:focus-visible]:z-10",
        "[&>[data-slot=button-group-text]:rounded-none]",
        "[&>[data-slot=button-group-text]:first-child]:rounded-l-lg",
        "[&>[data-slot=button-group-text]:last-child]:rounded-r-lg",
        "[&>[data-slot=button-group-separator]]:mx-2",
      ].join(" "),
      vertical: [
        "flex-col",
        "[&>button:not(:first-child)]:-mt-px",
        "[&>button]:rounded-none",
        "[&>button:first-child]:rounded-t-lg",
        "[&>button:last-child]:rounded-b-lg",
        "[&>button:focus-visible]:relative",
        "[&>button:focus-visible]:z-10",
        "[&>[data-slot=button]:not(:first-child)]:-mt-px",
        "[&>[data-slot=button]:rounded-none]",
        "[&>[data-slot=button]:first-child]:rounded-t-lg",
        "[&>[data-slot=button]:last-child]:rounded-b-lg",
        "[&>[data-slot=button]:focus-visible]:relative",
        "[&>[data-slot=button]:focus-visible]:z-10",
        "[&>[data-slot=dropdown-menu-trigger]:not(:first-child)]:-mt-px",
        "[&>[data-slot=dropdown-menu-trigger]:rounded-none]",
        "[&>[data-slot=dropdown-menu-trigger]:first-child]:rounded-t-lg",
        "[&>[data-slot=dropdown-menu-trigger]:last-child]:rounded-b-lg",
        "[&>[data-slot=popover-trigger]:not(:first-child)]:-mt-px",
        "[&>[data-slot=popover-trigger]:rounded-none]",
        "[&>[data-slot=popover-trigger]:first-child]:rounded-t-lg",
        "[&>[data-slot=popover-trigger]:last-child]:rounded-b-lg",
        "[&>[data-slot=input-group]:not(:first-child)]:-mt-px",
        "[&>[data-slot=input-group]]:[&_[data-slot=input]]:rounded-none",
        "[&>[data-slot=input-group]:first-child]:[&_[data-slot=input]]:rounded-t-lg",
        "[&>[data-slot=input-group]:last-child]:[&_[data-slot=input]]:rounded-b-lg",
        "[&>[data-slot=input-group]:focus-within]:relative",
        "[&>[data-slot=input-group]:focus-within]:z-10",
        "[&>[data-slot=input]:not(:first-child)]:-mt-px",
        "[&>[data-slot=input]:rounded-none]",
        "[&>[data-slot=input]:first-child]:rounded-t-lg",
        "[&>[data-slot=input]:last-child]:rounded-b-lg",
        "[&>[data-slot=input]:focus-visible]:relative",
        "[&>[data-slot=input]:focus-visible]:z-10",
        "[&>[data-slot=select-trigger]:not(:first-child)]:-mt-px",
        "[&>[data-slot=select-trigger]:rounded-none]",
        "[&>[data-slot=select-trigger]:first-child]:rounded-t-lg",
        "[&>[data-slot=select-trigger]:last-child]:rounded-b-lg",
        "[&>[data-slot=select-trigger]:focus-visible]:relative",
        "[&>[data-slot=select-trigger]:focus-visible]:z-10",
        "[&>[data-slot=button-group-text]:rounded-none]",
        "[&>[data-slot=button-group-text]:first-child]:rounded-t-lg",
        "[&>[data-slot=button-group-text]:last-child]:rounded-b-lg",
        "[&>[data-slot=button-group-separator]]:my-2",
      ].join(" "),
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
})

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="button-group-text"
      className={cn(
        "border-input bg-muted/40 text-muted-foreground inline-flex h-9 items-center border px-3 text-sm whitespace-nowrap",
        className
      )}
      {...props}
    />
  )
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical"
}) {
  return (
    <div
      data-slot="button-group-separator"
      data-orientation={orientation}
      className={cn(
        "bg-border shrink-0 self-stretch",
        orientation === "vertical" ? "my-1 w-px" : "mx-1 h-px",
        className
      )}
      {...props}
    />
  )
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText }
