"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { presetDateRanges } from "@/constants";
import { getPresetRange, presetValue } from "@/schemas/dateRangeSchema";
import { useRouter, useSearchParams } from "next/navigation";

interface DatePickerWithRangeProps {
  from: Date;
  to: Date;
}

export default function DatePickerWithRange({
  from,
  to,
}: DatePickerWithRangeProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from,
    to,
  });
  const [selectedPreset, setSelectedPreset] = useState<presetValue | undefined>(
    undefined,
  );
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateQueryParams = (from: Date, to: Date) => {
    const params = new URLSearchParams(searchParams);
    params.set("from", format(from, "yyyy-MM-dd"));
    params.set("to", format(to, "yyyy-MM-dd"));
    router.replace(`?${params.toString()}`);
  };

  const handlePresetSelect = (preset: presetValue) => {
    setSelectedPreset(preset);
    const { from, to } = getPresetRange(preset);
    setDate({ from, to });
    setOpen(false);
  };

  const handleDateChange = (range: DateRange | undefined) => {
    if (!range?.from || !range?.to) return;
    setDate(range);
    setSelectedPreset(undefined);
  };

  useEffect(() => {
    if (open) return; // only run when popover closes
    if (!date?.from || !date?.to) return;
    updateQueryParams(date.from, date.to);
  }, [open]);

  return (
    <Field className="w-60">
      <FieldLabel htmlFor="date-picker-range">Date Picker Range</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-range"
            className="justify-start px-2.5 font-normal"
          >
            <CalendarIcon />
            {selectedPreset ? (
              <span className="capitalize">{selectedPreset}</span>
            ) : date?.from ? (
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
                variant={selectedPreset === preset.value ? "default" : "ghost"}
                key={preset.value}
                onClick={() => handlePresetSelect(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
            showOutsideDays={false}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
