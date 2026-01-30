import { TRANSACTION_TYPES } from "@/constants";
import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.number().positive("Number should be greater than 0"),
  type: z.enum(TRANSACTION_TYPES),
  notes: z.string().optional(),
  date: z.date(),
  categoryId: z.string().optional(),
});

export type transactionInput = z.infer<typeof transactionSchema>;
