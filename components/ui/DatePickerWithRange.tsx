"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
  subWeeks,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

export default function DatePickerWithRange() {
  const [date, setDate] = useState<DateRange | undefined>();

  const presetDateRanges = [
    "Today",
    "This week",
    "This month",
    "This year",
    "Last week",
    "Last month",
  ];

  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(
    "This week",
  );

  const getPresetRange = (preset: string) => {
    const today = new Date();
    switch (preset) {
      case "Today":
        return {
          from: today,
          to: today,
        };
      case "This week":
        return {
          from: startOfWeek(today),
          to: endOfWeek(today),
        };
      case "Last week":
        const lastWeek = subWeeks(today, 1);
        return {
          from: startOfWeek(lastWeek),
          to: endOfWeek(lastWeek),
        };
      case "This month":
        return {
          from: startOfMonth(today),
          to: endOfMonth(today),
        };
      case "Last month":
        const lastMonth = subMonths(today, 1);
        return {
          from: startOfMonth(lastMonth),
          to: endOfMonth(lastMonth),
        };
      case "This year":
        return {
          from: startOfYear(today),
          to: endOfYear(today),
        };
      default:
        return { from: today, to: today };
    }
  };

  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    const { from, to } = getPresetRange(preset);
    setDate({ from, to });
  };

  return (
    <Field className="w-60">
      <FieldLabel htmlFor="date-picker-range">Date Picker Range</FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-range"
            className="justify-start px-2.5 font-normal"
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex gap-2" align="start">
          <div className="border-r p-3 flex flex-col gap-2">
            {presetDateRanges.map((preset) => (
              <Button
                size={"sm"}
                variant={selectedPreset === preset ? "default" : "ghost"}
                key={preset}
                onClick={() => handlePresetSelect(preset)}
              >
                {preset}
              </Button>
            ))}
          </div>
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
