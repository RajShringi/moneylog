import { parse, format, differenceInCalendarDays } from "date-fns";
import { DateGroupping } from "@/types/dashboard.type";

export function formatChartDate(value: string) {
  if (/^\d{4}-\d{2}$/.test(value)) {
    const date = parse(value, "yyyy-MM", new Date());
    return format(date, "MMM yyyy");
  }

  const date = parse(value, "yyyy-MM-dd", new Date());
  return format(date, "MMM d");
}

export function getDateGranularity(from: Date, to: Date): DateGroupping {
  const days = differenceInCalendarDays(to, from);
  if (days <= 31) return "day";
  else if (days <= 366) return "month";
  return "year";
}
