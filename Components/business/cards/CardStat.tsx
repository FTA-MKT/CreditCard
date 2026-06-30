"use client";

import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type CardStatTone = "success" | "warning" | "info" | "teal" | "primary";

export type CardStatProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  tone?: CardStatTone;
  className?: string;
  iconPanelClassName?: string;
};

const TONE_STYLES: Record<CardStatTone, { panel: string; icon: string }> = {
  success: {
    panel: "bg-success/18 text-success",
    icon: "text-success",
  },
  warning: {
    panel: "bg-warning/18 text-warning",
    icon: "text-warning",
  },
  info: {
    panel: "bg-info/18 text-info",
    icon: "text-info",
  },
  teal: {
    panel: "bg-[hsl(176_52%_82%)] text-[hsl(177_62%_42%)]",
    icon: "text-[hsl(177_62%_42%)]",
  },
  primary: {
    panel: "bg-primary/12 text-primary",
    icon: "text-primary",
  },
};

export function CardStat({
  title,
  value,
  subtitle,
  icon: Icon,
  tone = "primary",
  className,
  iconPanelClassName,
}: CardStatProps) {
  const styles = TONE_STYLES[tone];

  return (
    <Card className={cn("min-h-[92px] border-border/80 py-0", className)}>
      <CardContent className="flex h-full items-start justify-between gap-4 px-5 py-4">
        <div className="space-y-3">
          <div className="text-xs font-medium text-muted-foreground">{title}</div>
          <div className="space-y-1">
            <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
            {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
          </div>
        </div>
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-[10px]",
            styles.panel,
            iconPanelClassName,
          )}
        >
          <Icon className={cn("size-4", styles.icon)} strokeWidth={1.8} />
        </div>
      </CardContent>
    </Card>
  );
}
