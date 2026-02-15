import { endOfDay, isValid, parseISO, startOfMonth } from "date-fns";
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
    const today = new Date();
    const from = data.from ?? startOfMonth(today);
    const to = data.to ?? endOfDay(today);
    return { from, to };
  })
  .refine(
    (data) => {
      return data.from <= data.to;
    },
    { message: "From date must be before or equal to To date" },
  );

export function parseDateRange(input: Record<string, unknown>) {
  return dateRangeSchema.parse(input);
}
