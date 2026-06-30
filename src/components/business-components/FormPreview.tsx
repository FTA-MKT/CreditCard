"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function FormPreview() {
  return (
    <div className="space-y-8 max-w-lg">
      <div>
        <h2 className="mb-1 text-xl font-semibold text-foreground">Form</h2>
        <p className="text-sm text-muted-foreground">
          Form with inputs, labels, and actions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Update your account information below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" placeholder="Jane" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" placeholder="Doe" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="jane@example.com" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <div className="flex">
              <span className="flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                @
              </span>
              <Input
                id="username"
                placeholder="janedoe"
                className="rounded-l-none"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">
              Notifications
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notif">Email notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Receive updates via email
                </p>
              </div>
              <Switch id="email-notif" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketing">Marketing emails</Label>
                <p className="text-xs text-muted-foreground">
                  Receive promotional content
                </p>
              </div>
              <Switch id="marketing" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button>Save Changes</Button>
          <Button variant="outline">Cancel</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
