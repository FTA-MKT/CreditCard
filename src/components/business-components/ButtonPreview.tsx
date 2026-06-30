"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/lib/theme/context";
import type { CSSProperties } from "react";

export function ButtonPreview() {
  const { theme } = useTheme();

  // Apply button-radius from theme
  const btnStyle: CSSProperties = {
    borderRadius: `var(--button-radius, ${theme.radius}rem)`,
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="mb-1 text-xl font-semibold text-foreground">Button</h2>
        <p className="text-sm text-muted-foreground">
          All button variants with current theme applied.
        </p>
      </div>

      {/* Variants */}
      <section aria-labelledby="variants-heading">
        <h3 id="variants-heading" className="mb-3 text-sm font-semibold text-foreground uppercase tracking-wide">
          Variants
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button style={btnStyle}>Default</Button>
          <Button variant="secondary" style={btnStyle}>Secondary</Button>
          <Button variant="outline" style={btnStyle}>Outline</Button>
          <Button variant="ghost" style={btnStyle}>Ghost</Button>
          <Button variant="link" style={btnStyle}>Link</Button>
          <Button variant="destructive" style={btnStyle}>Destructive</Button>
        </div>
      </section>

      {/* Sizes */}
      <section aria-labelledby="sizes-heading">
        <h3 id="sizes-heading" className="mb-3 text-sm font-semibold text-foreground uppercase tracking-wide">
          Sizes
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" style={btnStyle}>Small</Button>
          <Button size="default" style={btnStyle}>Default</Button>
          <Button size="lg" style={btnStyle}>Large</Button>
        </div>
      </section>

      {/* States */}
      <section aria-labelledby="states-heading">
        <h3 id="states-heading" className="mb-3 text-sm font-semibold text-foreground uppercase tracking-wide">
          States
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button style={btnStyle}>Active</Button>
          <Button disabled style={btnStyle}>Disabled</Button>
          <Button variant="outline" style={btnStyle}>
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
            Loading
          </Button>
        </div>
      </section>

      {/* With badges */}
      <section aria-labelledby="badge-heading">
        <h3 id="badge-heading" className="mb-3 text-sm font-semibold text-foreground uppercase tracking-wide">
          Badges
        </h3>
        <div className="flex flex-wrap gap-3 items-center">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </section>
    </div>
  );
}
