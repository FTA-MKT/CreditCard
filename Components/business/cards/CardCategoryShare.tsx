"use client";

import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Cell, ChartContainer, Pie, PieChart, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export type CardCategoryShareProps = {
  title: string;
  percentage: number;
  amount: string;
  color: string;
  className?: string;
};

export function CardCategoryShare({
  title,
  percentage,
  amount,
  color,
  className,
}: CardCategoryShareProps) {
  const trackColor = "color-mix(in oklab, var(--border) 70%, transparent)";

  const chartConfig = React.useMemo(
    () =>
      ({
        share: { label: title, color },
        remainder: { label: "Remainder", color: trackColor },
      }) satisfies ChartConfig,
    [color, title],
  );

  const chartData = React.useMemo(
    () => [
      { name: "share", value: percentage, fill: color },
      { name: "remainder", value: Math.max(0, 100 - percentage), fill: trackColor },
    ],
    [color, percentage],
  );

  return (
    <Card
      size="compact"
      className={cn("min-h-[128px] border-transparent bg-muted py-0 shadow-none", className)}
    >
      <CardContent className="flex h-[128px] items-center justify-between px-5 py-5">
        <div className="space-y-2">
          <div className="text-sm font-medium text-foreground">{title}</div>
          <div className="text-[2rem] leading-none font-bold tabular-nums text-foreground">
            {percentage.toFixed(2)}%
          </div>
          <div className="text-base font-medium text-muted-foreground">{amount}</div>
        </div>
        <ChartContainer config={chartConfig} className="size-14 shrink-0">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={18}
              outerRadius={28}
              startAngle={90}
              endAngle={-270}
              strokeWidth={0}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
