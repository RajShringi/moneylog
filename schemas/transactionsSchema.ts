import { TRANSACTION_TYPES } from "@/constants";
import { z } from "zod";

export const transactionSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)), "Amount must be number")
    .refine((val) => Number(val) > 0, "Amount should be greater than 0"),
  type: z.enum(TRANSACTION_TYPES),
  note: z.string().trim().optional(),
  date: z.date(),
  categoryId: z.string(),
});

export type transactionInput = z.infer<typeof transactionSchema>;
