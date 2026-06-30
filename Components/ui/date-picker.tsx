"use client";

import { format } from "date-fns";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function formatShortDate(date?: Date) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatRangeLabel(value?: DateRange, placeholder = "Pick a date range") {
  if (!value?.from) return placeholder;
  if (!value.to) return format(value.from, "LLL dd, y");
  return `${format(value.from, "LLL dd, y")} - ${format(value.to, "LLL dd, y")}`;
}

type DatePickerProps = {
  value?: Date;
  onChange: (value: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  contentClassName?: string;
  align?: "start" | "center" | "end";
  iconPlacement?: "start" | "end";
};

function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  contentClassName,
  align = "start",
  iconPlacement = "end",
}: DatePickerProps) {
  const label = value ? formatShortDate(value) : placeholder;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-9 w-full justify-start rounded-[4px] border-border bg-background px-0 text-sm font-normal text-muted-foreground shadow-none hover:bg-background",
            iconPlacement === "start" && "px-3",
            value && "text-foreground",
            className,
          )}
        >
          {iconPlacement === "start" ? (
            <>
              <span className="mr-2">
                <CalendarDays className="h-4 w-4 shrink-0" />
              </span>
              <span className="truncate">{value ? format(value, "PPP") : placeholder}</span>
            </>
          ) : (
            <>
              <span className={cn("min-w-0 flex-1 truncate px-4 text-left", !value && "text-muted-foreground")}>
                {label}
              </span>
              <span className="flex h-full items-center border-l border-border px-3">
                <CalendarDays className="size-4 text-muted-foreground" />
              </span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-auto p-0", contentClassName)} align={align}>
        <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
      </PopoverContent>
    </Popover>
  );
}

type DateRangePickerProps = {
  value?: DateRange;
  onChange: (value: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  align?: "start" | "center" | "end";
  numberOfMonths?: number;
};

function DateRangePicker({
  value,
  onChange,
  placeholder = "Pick a date range",
  className,
  triggerClassName,
  contentClassName,
  align = "start",
  numberOfMonths = 2,
}: DateRangePickerProps) {
  const fromLabel = value?.from ? formatShortDate(value.from) : "Start Date";
  const toLabel = value?.to ? formatShortDate(value.to) : "End Date";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-9 w-full justify-start rounded-[4px] border-border bg-background px-0 text-sm font-normal text-muted-foreground shadow-none hover:bg-background",
            triggerClassName,
            className,
          )}
        >
          <span className="flex min-w-0 flex-1 items-center">
            <span className={cn("min-w-0 flex-1 truncate px-4 text-left", value?.from && "text-foreground")}>
              {value?.from ? fromLabel : placeholder}
            </span>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
            <span className={cn("min-w-0 flex-1 truncate px-4 text-left", value?.to && "text-foreground")}>
              {value?.from ? toLabel : "End Date"}
            </span>
          </span>
          <span className="flex h-full items-center border-l border-border px-3">
            <CalendarDays className="size-4 text-muted-foreground" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-auto p-0", contentClassName)} align={align}>
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          numberOfMonths={numberOfMonths}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

type CompactDateTimePickerProps = {
  value?: Date;
  onChange: (value: Date | undefined) => void;
  placeholder?: string;
  timeLabel?: string;
  onTimeClick?: () => void;
  className?: string;
  datePickerClassName?: string;
  timeButtonClassName?: string;
};

function CompactDateTimePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  timeLabel = "Select time",
  onTimeClick,
  className,
  datePickerClassName,
  timeButtonClassName,
}: CompactDateTimePickerProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <DatePicker
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={datePickerClassName}
      />
      <Button variant="outline" onClick={onTimeClick} className={timeButtonClassName}>
        <Clock3 className="mr-2 h-4 w-4" />
        {timeLabel}
      </Button>
    </div>
  );
}

export { CompactDateTimePicker, DatePicker, DateRangePicker };
