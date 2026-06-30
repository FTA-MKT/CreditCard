"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function InputPreview() {
  return (
    <div className="space-y-8 max-w-md">
      <div>
        <h2 className="mb-1 text-xl font-semibold text-foreground">Input</h2>
        <p className="text-sm text-muted-foreground">Text input variants and states.</p>
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="default-input">Default</Label>
          <Input id="default-input" placeholder="Enter text..." />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="disabled-input">Disabled</Label>
          <Input id="disabled-input" placeholder="Disabled input" disabled />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="error-input" className="text-destructive">
            Error state
          </Label>
          <Input
            id="error-input"
            placeholder="Invalid value"
            className="border-destructive focus-visible:ring-destructive"
            aria-invalid="true"
            aria-describedby="error-msg"
          />
          <p id="error-msg" className="text-xs text-destructive">
            This field is required.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="search-input">Search with button</Label>
          <div className="flex gap-2">
            <Input id="search-input" placeholder="Search..." className="flex-1" />
            <Button type="submit">Search</Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="file-input">File upload</Label>
          <Input id="file-input" type="file" />
        </div>
      </div>
    </div>
  );
}
