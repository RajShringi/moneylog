import { CATEGORY_COLORS, TRANSACTION_TYPES } from "@/constants";
import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(3, { message: "Category must be at least 3 characters long" }),
  type: z.enum(TRANSACTION_TYPES),
  color: z.enum(CATEGORY_COLORS.map((color) => color.value)),
});

export type categoryInput = z.infer<typeof categorySchema>;
