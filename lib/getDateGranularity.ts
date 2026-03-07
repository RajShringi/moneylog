import { DateGroupping } from "@/types/dashboard.type";
import { differenceInCalendarDays } from "date-fns";

export function getDateGranularity(from: Date, to: Date): DateGroupping {
  const days = differenceInCalendarDays(to, from);
  if (days <= 31) return "day";
  else if (days <= 366) return "month";
  return "year";
}
