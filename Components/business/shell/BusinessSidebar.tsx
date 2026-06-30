"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemo } from "@/components/demo/DemoContext";
import {
  ALL_VIEW_TYPES,
  getFilteredMenu,
  getViewMenu,
  VIEW_GROUPS,
  VIEW_LABELS,
  type MenuPage,
} from "@/lib/scene/menu-def";
import type { ViewType } from "@/lib/scene/types";
import { resolveIcon } from "@/lib/icon-map";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Check,
  ChevronsLeft,
  ChevronsRight,
  CircleHelp,
  LogOut,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

function AppGridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4.5" cy="4.5" r="2" />
      <circle cx="12" cy="4.5" r="2.4" />
      <circle cx="19.5" cy="4.5" r="2" />
      <circle cx="4.5" cy="12" r="2.6" />
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="19.5" cy="12" r="2.6" />
      <circle cx="4.5" cy="19.5" r="2" />
      <circle cx="12" cy="19.5" r="2.4" />
      <circle cx="19.5" cy="19.5" r="2" />
    </svg>
  );
}

export interface BusinessSidebarProps {
  viewOverride?: ViewType;
  pageSlugOverride?: string | null;
  embedded?: boolean;
  /**
   * 追加到当前 view sidebar 末尾的临时条目。用于 AI Builder 预览里插入合成出的
   * 新功能入口。点击时与真实 page 走同一个 `navigateToPage`,由 DemoProvider 的
   * `onNavigate` hook 决定是否真实路由。
   */
  injectedPages?: MenuPage[];
}

export function BusinessSidebar({
  viewOverride,
  pageSlugOverride,
  embedded = false,
  injectedPages,
}: BusinessSidebarProps = {}) {
  const {
    scene,
    brand,
    mode,
    currentView,
    setCurrentView,
    navigateToPage,
  } = useDemo();
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();
  const [viewOpen, setViewOpen] = useState(false);
  const collapsed = state === "collapsed";

  const segments = pathname.split("/").filter(Boolean);
  const urlView = segments[segments.length - 2] as ViewType;
  const pathnamePage = segments[segments.length - 1] ?? null;
  const effectiveView = viewOverride ?? (ALL_VIEW_TYPES.includes(urlView) ? urlView : currentView);
  const urlPage = pageSlugOverride ?? pathnamePage;

  useEffect(() => {
    if (effectiveView !== currentView) {
      setCurrentView(effectiveView);
    }
  }, [effectiveView]); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleItems = scene.visibleMenuItems[effectiveView];
  const pageOrder = scene.menuOrder?.[effectiveView];
  const baseMenu = getFilteredMenu(effectiveView, visibleItems, pageOrder);
  const menu = injectedPages && injectedPages.length > 0
    ? [...baseMenu, ...injectedPages]
    : baseMenu;

  function switchView(view: ViewType) {
    const m = getViewMenu(view);
    const vis = scene.visibleMenuItems[view];
    const firstPage = vis ? m.find((p) => p.slug in vis) : m[0];
    const pageSlug = firstPage?.slug ?? "summary";
    navigateToPage(view, pageSlug);
    setViewOpen(false);
  }

  return (
    <Sidebar
      collapsible={embedded ? "none" : "icon"}
      className="border-r border-border bg-muted text-foreground"
    >
      <SidebarHeader className="gap-0 p-0">
        <div className="relative flex h-12 items-center gap-3 border-b border-border px-3">
          {!embedded && (
            <Button
              variant="outline"
              size="icon-sm"
              onClick={toggleSidebar}
              className="absolute right-[-14px] bottom-[-14px] z-30 h-7 w-7 rounded-full bg-card shadow-sm"
              title={collapsed ? "Expand" : "Collapse"}
            >
              {collapsed ? (
                <ChevronsRight className="h-3.5 w-3.5" />
              ) : (
                <ChevronsLeft className="h-3.5 w-3.5" />
              )}
            </Button>
          )}

          <Popover open={viewOpen} onOpenChange={setViewOpen}>
            <PopoverTrigger asChild>
              <button
                className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                title="Switch view"
              >
                <AppGridIcon className="h-5 w-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-2" align="start" side="right">
              {VIEW_GROUPS.map((group) => {
                const views =
                  mode === "internal"
                    ? group.views
                    : group.views.filter((view) => scene.enabledViews.includes(view));
                if (views.length === 0) return null;
                return (
                  <div key={group.label} className="mb-1 last:mb-0">
                    <p className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {group.label}
                    </p>
                    {views.map((view) => (
                      <button
                        key={view}
                        className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-accent"
                        onClick={() => switchView(view)}
                      >
                        <span className="flex-1">{VIEW_LABELS[view]}</span>
                        {effectiveView === view && <Check className="h-3.5 w-3.5 text-primary" />}
                      </button>
                    ))}
                  </div>
                );
              })}
            </PopoverContent>
          </Popover>

          {mode === "internal" ? (
            <Link
              href="/admin"
              className="min-w-0 flex-1 opacity-80 transition-opacity hover:opacity-100 group-data-[collapsible=icon]:hidden"
              title="Back to Admin"
            >
              <img
                src="/fta-logo.svg"
                alt="FINTECH AUTOMATION"
                className="h-6 max-w-[120px] object-contain"
              />
            </Link>
          ) : (
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              {brand.logoUrl ? (
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="h-6 max-w-[120px] object-contain"
                  onError={(event) => {
                    event.currentTarget.src = "/fta-logo.svg";
                  }}
                />
              ) : (
                <img
                  src="/fta-logo.svg"
                  alt="FINTECH AUTOMATION"
                  className="h-6 max-w-[120px] object-contain"
                />
              )}
            </div>
          )}
        </div>

        <div className="mt-3 flex h-9 items-center justify-between px-4 group-data-[collapsible=icon]:hidden">
          <span className="text-sm font-semibold text-foreground">
            {VIEW_LABELS[effectiveView]} View
          </span>
          <Settings className="h-4 w-4 shrink-0 text-muted-foreground" />
        </div>
      </SidebarHeader>

      <SidebarContent
        className={cn(
          "gap-0 overflow-y-auto py-2",
          embedded ? "overscroll-auto" : "overscroll-contain"
        )}
      >
        <SidebarMenu className="gap-0.5 px-2">
          {menu.map((page) => {
            const isActive = urlPage === page.slug;
            const PageIcon = resolveIcon(page.icon);

            return (
              <SidebarMenuItem key={page.slug}>
                <SidebarMenuButton
                  tooltip={page.label}
                  isActive={isActive}
                  onClick={() => navigateToPage(effectiveView, page.slug)}
                  className={collapsed ? "justify-center" : undefined}
                  collapsedIcon={<PageIcon className="h-4 w-4 shrink-0" />}
                >
                  <span>{page.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="gap-0 border-t border-border p-0">
        <SidebarMenu className="gap-0">
          {mode === "client" && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Exit Demo" className="text-xs text-muted-foreground">
                <Link href="/admin">
                  <LogOut className="h-3.5 w-3.5 shrink-0" />
                  <span>Exit Demo</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Help">
              <CircleHelp className="h-4 w-4 shrink-0" />
              <span>Help</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
