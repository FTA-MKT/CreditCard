"use client";

import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type CardOfferDetail = {
  label: string;
  kind?: "detail" | "link";
};

export type CardOfferProps = {
  category: string;
  title: string;
  description: string;
  details: readonly CardOfferDetail[];
  layout?: "grid" | "list";
  ctaLabel?: string;
  className?: string;
};

export function CardOffer({
  category,
  title,
  description,
  details,
  layout = "grid",
  ctaLabel = "Get started",
  className,
}: CardOfferProps) {
  if (layout === "list") {
    return (
      <Card className={cn("border-border/80 py-5", className)}>
        <CardContent className="grid gap-5 xl:grid-cols-[minmax(0,260px)_1px_minmax(0,1fr)]">
          <div className="space-y-2">
            <div className="text-xs leading-[18px] text-primary">{category}</div>
            <div className="text-[20px] font-bold leading-[30px] tracking-normal text-foreground">
              {title}
            </div>
            <div className="text-xs leading-5 text-muted-foreground">{description}</div>
            <div className="pt-2">
              <Button variant="outline" className="w-full sm:w-[190px]">
                {ctaLabel}
              </Button>
            </div>
          </div>
          <Separator orientation="vertical" className="hidden xl:block" />
          <AccountOfferDetailList items={details} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("h-full min-h-[352px] border-border/80 py-5", className)}>
      <CardHeader className="gap-2">
        <div className="text-xs leading-[18px] text-primary">{category}</div>
        <CardTitle className="text-[20px] font-bold leading-[30px] tracking-normal text-foreground">
          {title}
        </CardTitle>
        <CardDescription className="text-xs leading-5">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-4">
        <Separator />
        <AccountOfferDetailList items={details} />
        <div className="mt-auto">
          <Button variant="outline" className="w-full">
            {ctaLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AccountOfferDetailList({
  items,
}: {
  items: readonly CardOfferDetail[];
}) {
  return (
    <div className="space-y-1.5">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-start gap-2 text-sm">
          {item.kind === "link" ? (
            <>
              <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-transparent" />
              <Button
                variant="link"
                className="h-auto justify-start px-0 py-0 text-xs leading-5"
              >
                {item.label}
              </Button>
            </>
          ) : (
            <>
              <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center text-success">
                <Check className="size-3.5" />
              </div>
              <span className="leading-5 text-muted-foreground">{item.label}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
