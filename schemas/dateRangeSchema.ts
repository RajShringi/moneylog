import { presetDateRanges } from "@/constants";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  isValid,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
  subWeeks,
} from "date-fns";
import { z } from "zod";

const dateStringSchema = z
  .string()
  .optional()
  .transform((val) => {
    if (!val) return undefined;
    const parsed = parseISO(val);
    if (!isValid(parsed)) return undefined;
    return parsed;
  });

export const dateRangeSchema = z
  .object({
    from: dateStringSchema,
    to: dateStringSchema,
  })
  .transform((data) => {
    console.log("Raw data.from:", data.from);
    console.log("Raw data.to:", data.to);

    const today = startOfDay(new Date());
    console.log("today:", today);
    console.log("endOfDay(today):", endOfDay(today));

    const from = data.from ?? startOfMonth(today);
    const to = data.to ?? endOfDay(today);

    console.log("final from:", from);
    console.log("final to:", to);

    console.log(
      "Server timezone:",
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );
    console.log("Server from:", from);
    console.log("Server to:", to);
    console.log("Server to ISO:", to.toISOString());

    return { from, to };
  })
  .refine(
    (data) => {
      return data.from <= data.to;
    },
    { message: "From date must be before or equal to To date" },
  );

export type presetValue = (typeof presetDateRanges)[number]["value"];

export function parseDateRange(input: Record<string, unknown>) {
  return dateRangeSchema.parse(input);
}

export const getPresetRange = (preset: presetValue) => {
  const start = startOfDay(new Date());
  const end = endOfDay(new Date());

  switch (preset) {
    case "today":
      return {
        from: start,
        to: end,
      };
    case "this week":
      return {
        from: startOfWeek(start),
        to: endOfWeek(end),
      };
    case "last week":
      const lastWeek = subWeeks(start, 1);
      return {
        from: startOfWeek(lastWeek),
        to: endOfWeek(lastWeek),
      };
    case "this month":
      return {
        from: startOfMonth(start),
        to: endOfMonth(end),
      };
    case "last month":
      const lastMonth = subMonths(start, 1);
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth),
      };
    case "this year":
      return {
        from: startOfYear(start),
        to: endOfYear(end),
      };
    default:
      return { from: start, to: end };
  }
};
