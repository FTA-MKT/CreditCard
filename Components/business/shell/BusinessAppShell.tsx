"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PortalHostProvider } from "@/lib/theme/portal-host-context";
import { BusinessSidebar } from "@/components/business/shell/BusinessSidebar";
import { BusinessTopBar, type BusinessTopBarProps } from "@/components/business/shell/BusinessTopBar";
import type { MenuPage } from "@/lib/scene/menu-def";
import { cn } from "@/lib/utils";

export interface BusinessAppShellProps extends BusinessTopBarProps {
  cssVars: Record<string, string>;
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
  onContentClick?: () => void;
  hideSidebar?: boolean;
  embedded?: boolean;
  /**
   * 追加到 sidebar 的临时条目(AI Builder 预览用)。传递给 `BusinessSidebar`。
   */
  injectedPages?: MenuPage[];
}

export function BusinessAppShell({
  cssVars,
  children,
  rightPanel,
  onContentClick,
  hideSidebar,
  rightSlot,
  leftSlot,
  viewOverride,
  pageSlugOverride,
  embedded = false,
  injectedPages,
}: BusinessAppShellProps) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const resolvedFontFamily =
    (cssVars["--preview-font"] as string | undefined) ?? 'var(--font-inter-loaded), "Helvetica Neue", Arial, sans-serif';
  const portalRef = useCallback((node: HTMLDivElement | null) => {
    setPortalContainer(node);
  }, []);

  useEffect(() => {
    if (embedded) {
      return;
    }
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [embedded]);

  return (
    <PortalHostProvider container={portalContainer}>
      <div
        className={
          rightPanel
            ? embedded
              ? "flex h-full overflow-hidden"
              : "flex h-screen overflow-hidden"
            : embedded
              ? "flex h-full bg-background font-sans text-foreground"
              : "flex h-screen bg-background font-sans text-foreground"
        }
      >
        <div
          style={{
            ...(cssVars as CSSProperties),
            fontFamily: resolvedFontFamily,
          }}
          className={rightPanel ? "flex min-w-0 flex-1 bg-background font-sans text-foreground" : "flex min-w-0 flex-1"}
        >
          <div ref={portalRef} data-portal-host="" />
          <SidebarProvider
            defaultOpen
            className={embedded ? "h-full flex-1" : "min-h-screen flex-1"}
            style={
              {
                "--sidebar-width": "12.5rem",
                "--sidebar-width-icon": "3.5rem",
              } as CSSProperties
            }
          >
            {!hideSidebar && (
              <BusinessSidebar
                viewOverride={viewOverride}
                pageSlugOverride={pageSlugOverride}
                embedded={embedded}
                injectedPages={injectedPages}
              />
            )}
            <SidebarInset className="min-w-0 overflow-hidden">
              <BusinessTopBar
                rightSlot={rightSlot}
                leftSlot={leftSlot}
                viewOverride={viewOverride}
                pageSlugOverride={pageSlugOverride}
              />
              <div
                className={cn(
                  "min-h-0 flex-1 overflow-auto",
                  embedded ? "overscroll-auto" : "overscroll-contain",
                  onContentClick && "cursor-pointer"
                )}
                onClick={onContentClick}
              >
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
        {rightPanel}
      </div>
    </PortalHostProvider>
  );
}
