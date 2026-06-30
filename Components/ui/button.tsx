import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const BUTTON_VARIANTS = [
  "default",
  "success",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
] as const

const BUTTON_SIZES = [
  "default",
  "xs",
  "sm",
  "lg",
  "icon",
  "icon-xs",
  "icon-sm",
  "icon-lg",
] as const

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 data-[icon=leading]:[&_svg]:order-first data-[icon=trailing]:[&_svg]:order-last outline-none focus-visible:outline-1 focus-visible:outline-ring aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        success: "bg-success text-success-foreground hover:bg-success/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:bg-destructive/60",
        // FTA: Outline uses primary-colored border + text (matches design system)
        outline:
          "border border-primary/40 bg-background text-primary hover:border-primary/60 hover:bg-primary/5",
        // FTA: Secondary uses light bg with primary-colored text (matches design system)
        secondary:
          "bg-secondary text-primary hover:bg-accent hover:text-primary",
        ghost:
          "text-primary hover:bg-accent hover:text-primary dark:hover:bg-accent/50",
        link: "h-auto rounded-none p-0 text-primary font-normal underline-offset-4 hover:bg-transparent hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-lg px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-lg px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    compoundVariants: [
      {
        variant: "link",
        size: ["default", "xs", "sm", "lg"],
        className: "h-auto rounded-none p-0",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants, BUTTON_VARIANTS, BUTTON_SIZES }
