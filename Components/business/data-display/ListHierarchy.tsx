"use client";

import * as React from "react";
import { ChevronDown, ChevronRight, EyeOff } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FileTree, type FileTreeNode } from "@/components/ui/file-tree";
import { Separator } from "@/components/ui/separator";

export type HierarchyNestedItem = {
  name: string;
  masked: string;
  amount: string;
};

export type HierarchyItem = {
  name: string;
  masked: string;
  amount: string;
  external?: boolean;
  nested?: HierarchyNestedItem[];
};

export type HierarchyGroup = {
  title: string;
  items: HierarchyItem[];
};

export type ListHierarchyProps = {
  groups: HierarchyGroup[];
  defaultOpenSections?: string[];
  trailingSectionTitles?: string[];
};

function TreeSectionToggle({
  title,
  open,
}: {
  title: string;
  open: boolean;
}) {
  return (
    <div className="flex items-center gap-1 text-left text-[15px] font-semibold leading-6 text-primary">
      {open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
      {title}
    </div>
  );
}

function hierarchyNodeLabel(item: HierarchyItem | HierarchyNestedItem, external?: boolean) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="truncate text-[15px] font-medium leading-6 text-foreground">{item.name}</div>
      {external ? (
        <Badge className="rounded-[2px] bg-primary/10 px-1 py-0 text-[10px] font-normal leading-4 text-primary">
          External
        </Badge>
      ) : null}
    </div>
  );
}

function hierarchyNodeDescription(item: HierarchyItem | HierarchyNestedItem) {
  return (
    <div className="mt-0.5 flex items-center gap-1 text-[11px] font-normal leading-4 text-muted-foreground">
      <span>{item.masked}</span>
      <EyeOff className="size-3" />
    </div>
  );
}

function mapNestedNode(child: HierarchyNestedItem, index: number): FileTreeNode {
  return {
    id: `${child.name}-${index}`,
    label: <div className="text-[15px] font-normal leading-6 text-muted-foreground">{child.name}</div>,
    description: hierarchyNodeDescription(child),
    trailing: (
      <span className="whitespace-nowrap pl-2 text-right text-[15px] font-normal leading-6 tabular-nums text-muted-foreground">
        {child.amount}
      </span>
    ),
    tone: "muted",
    rowClassName: "py-1.5",
  };
}

function mapHierarchyNode(item: HierarchyItem, index: number): FileTreeNode {
  return {
    id: `${item.name}-${index}`,
    label: hierarchyNodeLabel(item, item.external),
    description: hierarchyNodeDescription(item),
    trailing: (
      <div className="flex items-center justify-end gap-1.5 whitespace-nowrap pl-2 text-[15px] font-medium leading-6 text-foreground">
        <span className="tabular-nums">{item.amount}</span>
        <ChevronRight className="size-3.5 text-muted-foreground" />
      </div>
    ),
    defaultOpen: true,
    children: item.nested?.map(mapNestedNode),
    rowClassName: "py-1.5",
    childrenWrapperClassName: item.nested?.length
      ? "px-3.5 py-2"
      : undefined,
  };
}

export function ListHierarchy({
  groups,
  defaultOpenSections = ["Assets"],
  trailingSectionTitles = ["Liabilities"],
}: ListHierarchyProps) {
  const [assetsOpen, setAssetsOpen] = React.useState(
    defaultOpenSections.includes("Assets")
  );

  return (
    <div className="space-y-3">
      <Collapsible open={assetsOpen} onOpenChange={setAssetsOpen}>
        <CollapsibleTrigger asChild>
          <button type="button" className="block w-full">
            <TreeSectionToggle title="Assets" open={assetsOpen} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2.5">
          <div className="space-y-2.5 pl-5">
            {groups.map((group) => (
              <div key={group.title} className="space-y-2">
                <div className="text-[15px] font-semibold leading-6 text-muted-foreground">{group.title}</div>
                <FileTree items={group.items.map(mapHierarchyNode)} className="gap-2" indent={18} />
                <Separator />
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {trailingSectionTitles.map((title) => (
        <TreeSectionToggle key={title} title={title} open={defaultOpenSections.includes(title)} />
      ))}
    </div>
  );
}
