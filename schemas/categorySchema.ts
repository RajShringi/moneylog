import { CATEGORY_COLORS, TRANSACTION_TYPES } from "@/constants";
import { CategoryColorKey } from "@/types/category.types";
import { z } from "zod";

const categoryColorKeys = Object.keys(CATEGORY_COLORS) as [
  CategoryColorKey,
  ...CategoryColorKey[],
];

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Category must be at least 3 characters long" }),
  type: z.enum(TRANSACTION_TYPES),
  color: z.enum(categoryColorKeys),
});

export type categoryInput = z.infer<typeof categorySchema>;
