"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function CardPreview() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="mb-1 text-xl font-semibold text-foreground">Card</h2>
        <p className="text-sm text-muted-foreground">Card component variants.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Basic card */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Create your first project in minutes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Follow the quickstart guide to set up your development environment
              and deploy your first app.
            </p>
          </CardContent>
          <CardFooter className="gap-2">
            <Button size="sm">Get Started</Button>
            <Button size="sm" variant="ghost">
              Learn More
            </Button>
          </CardFooter>
        </Card>

        {/* Stats card */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl">$45,231.89</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        {/* Team member card */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">Jane Doe</CardTitle>
              <CardDescription>Product Designer</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1 flex-wrap">
              <Badge variant="secondary">Figma</Badge>
              <Badge variant="secondary">UI/UX</Badge>
              <Badge variant="secondary">React</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notification card */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Deployment Successful</CardTitle>
            <CardDescription>
              Production environment updated to v2.4.1
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">2 minutes ago</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
