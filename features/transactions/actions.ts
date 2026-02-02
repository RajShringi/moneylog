"use server";

import { auth } from "@/auth";
import { TRANSACTIONS_PAGE_LIMIT } from "@/constants";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import {
  transactionInput,
  transactionSchema,
} from "@/schemas/transactionsSchema";
import { ActionResult } from "@/types/action.type";
import {
  TransactionPreview,
  TransactionsPageResponse,
} from "@/types/transaction.types";
import { revalidatePath } from "next/cache";

// create Transaction
export async function createTransaction(
  data: transactionInput,
): Promise<ActionResult<null>> {
  // TODO: use try catch here.
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
    note: data.note || "",
    date: data.date,
  });

  revalidatePath("/dashboard/transactions");

  return {
    success: true,
    data: null,
    message: "Transaction created successfully",
  };
}

// fetch transaction by limit
export async function fetchTransactions(
  page: number,
): Promise<ActionResult<TransactionsPageResponse>> {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "user is not logged-in" };
    }
    await dbConnect();

    const skip = (page - 1) * TRANSACTIONS_PAGE_LIMIT;
    const [transactions, total] = await Promise.all([
      Transaction.find({ userId: session.user.id })
        .populate("categoryId")
        .limit(TRANSACTIONS_PAGE_LIMIT)
        .skip(skip)
        .lean(),
      Transaction.countDocuments({ userId: session.user.id }),
    ]);

    const serializeTransactions = transactions.map(
      (transaction: any): TransactionPreview => ({
        _id: transaction._id.toString(),
        amount: transaction.amount,
        date: transaction.date,
        category: transaction.categoryId.name,
        note: transaction.note,
        type: transaction.type,
      }),
    );

    return {
      success: true,
      data: { transactions: serializeTransactions, total },
      message: "Transaction fetch successfully",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Transactions fetch failed",
    };
  }
}
