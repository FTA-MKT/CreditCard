"use client";

import { Progress } from "@/components/ui/progress";

export type RowMetricProgressProps = {
  label: string;
  percentage: number;
  amount: string;
  color: string;
};

export function RowMetricProgress({
  label,
  percentage,
  amount,
  color,
}: RowMetricProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-foreground/90">{label}</span>
        <div className="flex items-center gap-3 tabular-nums">
          <span className="text-sm text-foreground">{percentage.toFixed(2)}%</span>
          <span className="text-sm text-foreground">{amount}</span>
        </div>
      </div>
      <Progress
        value={percentage}
        className="h-2.5 bg-border/70"
        indicatorStyle={{ backgroundColor: color }}
      />
    </div>
  );
}
