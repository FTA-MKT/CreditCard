"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DialogPreview() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="mb-1 text-xl font-semibold text-foreground">Dialog</h2>
        <p className="text-sm text-muted-foreground">
          Modal dialogs with proper ARIA attributes.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Basic dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent aria-describedby="dialog-desc">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription id="dialog-desc">
                Make changes to your profile here. Click save when done.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="dlg-name">Name</Label>
                <Input id="dlg-name" defaultValue="Jane Doe" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dlg-email">Email</Label>
                <Input id="dlg-email" defaultValue="jane@example.com" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Destructive dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete Account</Button>
          </DialogTrigger>
          <DialogContent aria-describedby="delete-desc">
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription id="delete-desc">
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline">Cancel</Button>
              <Button variant="destructive">Delete Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
