import * as React from "react"
import { cn } from "@/lib/utils"

// ── InputGroup wrapper ────────────────────────────────────────────────────────
function InputGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="input-group"
      className={cn("relative flex w-full min-w-0 items-center", className)}
      {...props}
    />
  )
}

// ── InputAddon (prefix/suffix container) ─────────────────────────────────────
interface InputAddonProps extends React.HTMLAttributes<HTMLDivElement> {
  side: "left" | "right"
}

function InputAddon({ side, className, ...props }: InputAddonProps) {
  return (
    <div
      data-slot="input-addon"
      data-side={side}
      className={cn(
        "pointer-events-none absolute inset-y-0 flex items-center text-muted-foreground",
        side === "left" ? "left-0 pl-3" : "right-0 pr-3",
        className
      )}
      {...props}
    />
  )
}

// ── Usage note ────────────────────────────────────────────────────────────────
// Use with Input — add pl-9 or pr-9 to the Input depending on which side has an addon
// Example:
//   <InputGroup>
//     <InputAddon side="left"><Search className="h-4 w-4" /></InputAddon>
//     <Input className="pl-9" placeholder="Search..." />
//   </InputGroup>

export { InputGroup, InputAddon }
export type { InputAddonProps }
