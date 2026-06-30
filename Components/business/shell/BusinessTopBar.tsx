"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bell, User } from "lucide-react";
import { useDemo } from "@/components/demo/DemoContext";
import { PageTabsShell } from "@/components/ui/page-tabs";
import { ALL_VIEW_TYPES, getFilteredTabs, getPageForModule } from "@/lib/scene/menu-def";
import type { ViewType } from "@/lib/scene/types";

export interface BusinessTopBarProps {
  rightSlot?: React.ReactNode;
  leftSlot?: React.ReactNode;
  viewOverride?: ViewType;
  pageSlugOverride?: string | null;
}

export function BusinessTopBar({
  rightSlot,
  leftSlot,
  viewOverride,
  pageSlugOverride,
}: BusinessTopBarProps) {
  const { scene, currentView, activeTab, setActiveTab } = useDemo();
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const pathnamePageSlug = segments[segments.length - 1];
  const urlView = segments[segments.length - 2] as ViewType;
  const effectiveView = viewOverride ?? (ALL_VIEW_TYPES.includes(urlView) ? urlView : currentView);
  const pageSlug = pageSlugOverride ?? pathnamePageSlug;

  const pageDef = getPageForModule(effectiveView, pageSlug);
  const pageLabel = pageDef?.label ?? "";

  const visibleItems = scene.visibleMenuItems[effectiveView];
  const tabs = getFilteredTabs(effectiveView, pageSlug, visibleItems);
  const resolvedActiveTab =
    activeTab &&
    tabs.some((tab) => tab.slug === activeTab || tab.subTabs?.some((subTab) => subTab.slug === activeTab))
      ? activeTab
      : tabs[0]?.subTabs?.[0]?.slug ?? tabs[0]?.slug ?? null;

  useEffect(() => {
    const nextResolvedActiveTab =
      activeTab &&
      tabs.some((tab) => tab.slug === activeTab || tab.subTabs?.some((subTab) => subTab.slug === activeTab))
        ? activeTab
        : tabs[0]?.subTabs?.[0]?.slug ?? tabs[0]?.slug ?? null;

    if (tabs.length > 0) {
      if (activeTab !== nextResolvedActiveTab) {
        setActiveTab(nextResolvedActiveTab);
      }
    } else if (activeTab !== null) {
      setActiveTab(null);
    }
  }, [pageSlug, effectiveView]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <header className="flex h-12 shrink-0 items-center gap-4 border-b px-6">
      <div className="flex h-full min-w-0 flex-1 items-center overflow-hidden">
        {leftSlot ? (
          leftSlot
        ) : pageLabel && tabs.length > 0 ? (
          <PageTabsShell
            pageLabel={pageLabel}
            items={tabs.map((tab) => ({
              value: tab.slug,
              label: tab.label,
              items: tab.subTabs?.map((subTab) => ({
                value: subTab.slug,
                label: subTab.label,
              })),
            }))}
            value={resolvedActiveTab}
            onValueChange={setActiveTab}
          />
        ) : pageLabel ? (
          <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-foreground">
            {pageLabel}
          </span>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {rightSlot && (
          <>
            {rightSlot}
            <div className="h-4 w-px bg-border" />
          </>
        )}
        <button className="flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground">
          <Bell className="h-4 w-4" />
        </button>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c9cdd4]">
          <User className="h-4 w-4 text-white" />
        </div>
      </div>
    </header>
  );
}
