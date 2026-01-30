"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import {
  transactionInput,
  transactionSchema,
} from "@/schemas/transactionsSchema";
import { ActionResult } from "@/types/action.type";
import { revalidatePath } from "next/cache";

export async function createTransaction(
  data: transactionInput,
): Promise<ActionResult<null>> {
  const session = await auth();
  if (!session || !session.user) {
    return { success: false, error: "User is not logged-in" };
  }

  await dbConnect();

  // Validate the data using zod
  const validated = transactionSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      error: "Invalid data",
    };
  }

  // Create the transaction
  await Transaction.create({
    userId: session.user.id,
    amount: data.amount,
    type: data.type,
    categoryId: data.categoryId || undefined,
    note: data.notes || "",
    date: data.date,
  });

  revalidatePath("/dashboard/transactions");

  return {
    success: true,
    data: null,
    message: "Transaction created successfully",
  };
}
