"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const INVOICES = [
  { id: "INV-001", customer: "Acme Corp", amount: "$1,250.00", status: "Paid", date: "2025-01-15" },
  { id: "INV-002", customer: "Globex Inc", amount: "$2,800.00", status: "Pending", date: "2025-01-22" },
  { id: "INV-003", customer: "Initech", amount: "$450.00", status: "Overdue", date: "2025-01-05" },
  { id: "INV-004", customer: "Umbrella Ltd", amount: "$3,100.00", status: "Paid", date: "2025-02-01" },
  { id: "INV-005", customer: "Wayne Ent.", amount: "$9,999.00", status: "Draft", date: "2025-02-10" },
];

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Paid: "default",
  Pending: "secondary",
  Overdue: "destructive",
  Draft: "outline",
};

export function TablePreview() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="mb-1 text-xl font-semibold text-foreground">Table</h2>
        <p className="text-sm text-muted-foreground">Data table with badge statuses.</p>
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableCaption>Recent invoices from the past 30 days.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {INVOICES.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-mono text-sm">{inv.id}</TableCell>
                <TableCell>{inv.customer}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[inv.status] ?? "outline"}>
                    {inv.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{inv.date}</TableCell>
                <TableCell className="text-right font-medium">{inv.amount}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
