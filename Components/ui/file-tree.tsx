"use client"

import * as React from "react"
import { ChevronRightIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

export type FileTreeNode = {
  id: string
  label: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  trailing?: React.ReactNode
  children?: FileTreeNode[]
  defaultOpen?: boolean
  tone?: "default" | "muted"
  rowClassName?: string
  childrenWrapperClassName?: string
}

type FileTreeProps = {
  items: FileTreeNode[]
  className?: string
  indent?: number
}

function FileTree({ items, className, indent = 14 }: FileTreeProps) {
  return (
    <div data-slot="file-tree" className={cn("flex flex-col gap-1", className)}>
      {items.map((item) => (
        <FileTreeBranch key={item.id} item={item} level={0} indent={indent} />
      ))}
    </div>
  )
}

function FileTreeBranch({
  item,
  level,
  indent,
}: {
  item: FileTreeNode
  level: number
  indent: number
}) {
  const [open, setOpen] = React.useState(item.defaultOpen ?? false)
  const isBranch = Boolean(item.children?.length)

  const row = (
    <div
      className={cn(
        "flex min-w-0 items-start gap-2 rounded-md px-2.5 py-2 text-left",
        item.tone === "muted" ? "text-muted-foreground" : "text-foreground",
        item.rowClassName
      )}
    >
      <span className="flex h-5 w-4 shrink-0 items-center justify-center text-muted-foreground">
        {isBranch ? (
          <ChevronRightIcon
            className={cn("size-4 transition-transform", open && "rotate-90")}
          />
        ) : null}
      </span>
      {item.icon ? (
        <span className="mt-0.5 flex shrink-0 items-center justify-center text-muted-foreground">
          {item.icon}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="min-w-0">{item.label}</div>
        {item.description ? (
          <div className="mt-0.5 min-w-0">{item.description}</div>
        ) : null}
      </div>
      {item.trailing ? <div className="shrink-0">{item.trailing}</div> : null}
    </div>
  )

  if (!isBranch) {
    return (
      <div
        data-slot="file-tree-node"
        style={{ paddingInlineStart: `${level * indent}px` }}
      >
        {row}
      </div>
    )
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div
        data-slot="file-tree-node"
        style={{ paddingInlineStart: `${level * indent}px` }}
      >
        <CollapsibleTrigger asChild>
          <button type="button" className="block w-full">
            {row}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1">
          <div
            className={cn("flex flex-col gap-1", item.childrenWrapperClassName)}
          >
            {item.children?.map((child) => (
              <FileTreeBranch
                key={child.id}
                item={child}
                level={level + 1}
                indent={indent}
              />
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

export { FileTree }
