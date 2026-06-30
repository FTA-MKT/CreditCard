import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "group/card @container/card bg-card text-card-foreground flex flex-col gap-6 overflow-hidden rounded-[calc(var(--radius)+2px)] border border-border py-6 shadow-sm",
  {
    variants: {
      size: {
        default: "",
        sm: "gap-4 py-4",
        compact: "gap-4 py-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function Card({
  className,
  size = "default",
  style,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(cardVariants({ size }), className)}
      style={{
        borderWidth: "var(--surface-border-width)",
        borderColor: "var(--surface-border-color)",
        boxShadow: "var(--surface-shadow)",
        ...style,
      }}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-action]:gap-x-4 group-data-[size=sm]/card:gap-1 group-data-[size=sm]/card:px-4 group-data-[size=compact]/card:gap-1 group-data-[size=compact]/card:px-5",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold tracking-tight", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm leading-5", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 group-data-[size=sm]/card:px-4 group-data-[size=compact]/card:px-5", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6 group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:[.border-t]:pt-4 group-data-[size=compact]/card:px-5 group-data-[size=compact]/card:[.border-t]:pt-5", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
