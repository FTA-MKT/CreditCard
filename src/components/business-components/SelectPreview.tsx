"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function SelectPreview() {
  return (
    <div className="space-y-8 max-w-md">
      <div>
        <h2 className="mb-1 text-xl font-semibold text-foreground">Select</h2>
        <p className="text-sm text-muted-foreground">
          Dropdown select with groups and accessibility.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="framework-select">Framework</Label>
          <Select>
            <SelectTrigger id="framework-select" aria-label="Select a framework" className="w-full">
              <SelectValue placeholder="Select a framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>React</SelectLabel>
                <SelectItem value="next">Next.js</SelectItem>
                <SelectItem value="remix">Remix</SelectItem>
                <SelectItem value="vite">Vite + React</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Vue</SelectLabel>
                <SelectItem value="nuxt">Nuxt.js</SelectItem>
                <SelectItem value="quasar">Quasar</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Other</SelectLabel>
                <SelectItem value="svelte">SvelteKit</SelectItem>
                <SelectItem value="astro">Astro</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="timezone-select">Timezone</Label>
          <Select defaultValue="utc">
            <SelectTrigger id="timezone-select" aria-label="Select timezone" className="w-full">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
              <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
              <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
              <SelectItem value="cst">CST (China Standard Time)</SelectItem>
              <SelectItem value="jst">JST (Japan Standard Time)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="disabled-select">Disabled</Label>
          <Select disabled>
            <SelectTrigger id="disabled-select" aria-label="Disabled select" className="w-full">
              <SelectValue placeholder="Cannot select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
