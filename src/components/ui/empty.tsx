import * as React from "react"
import { cn } from "@/lib/utils"

interface EmptyProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  iconContainerClassName?: string
}

function Empty({
  className,
  icon,
  title,
  description,
  action,
  iconContainerClassName,
  ...props
}: EmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12 px-6 text-center",
        className
      )}
      {...props}
    >
      {icon && (
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground",
            iconContainerClassName
          )}
        >
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <div className="text-sm font-medium text-foreground">{title}</div>
        {description && (
          <div className="max-w-xs text-sm text-muted-foreground">{description}</div>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}

export { Empty }
export type { EmptyProps }
