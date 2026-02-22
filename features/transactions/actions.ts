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
import { DashboardSummary } from "@/types/dashboard.type";
import { SortBy, SortOrder } from "@/types/pagination.types";
import {
  TransactionPreview,
  TransactionsPageResponse,
} from "@/types/transaction.types";
import { endOfDay } from "date-fns";
import mongoose from "mongoose";
import { PipelineStage } from "mongoose";
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
  search: string,
  sortBy: SortBy,
  sortOrder: SortOrder,
): Promise<ActionResult<TransactionsPageResponse>> {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "user is not logged-in" };
    }
    await dbConnect();
    const skip = (page - 1) * TRANSACTIONS_PAGE_LIMIT;

    const pipeline: PipelineStage[] = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(session.user.id),
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $match: {
          $or: [
            { note: { $regex: search, $options: "i" } },
            {
              "category.name": { $regex: search, $options: "i" },
            },
          ],
        },
      },
      {
        $facet: {
          transactions: [
            {
              $sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 },
            },
            {
              $skip: skip,
            },
            {
              $limit: TRANSACTIONS_PAGE_LIMIT,
            },
          ],
          total: [
            {
              $count: "count",
            },
          ],
        },
      },
    ];

    const response = await Transaction.aggregate(pipeline);
    const transactions = response[0]?.transactions ?? [];
    const total = response[0]?.total[0]?.count ?? 0;

    const serializeTransactions = transactions.map(
      (transaction: any): TransactionPreview => ({
        _id: transaction._id.toString(),
        amount: transaction.amount,
        date: transaction.date,
        category: transaction.category.name,
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

// fetch dashboard summary card info
export async function fetchDashboardSummary(
  from: Date,
  to: Date,
): Promise<ActionResult<DashboardSummary>> {
  try {
    await dbConnect();
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "user is not logged-in" };
    }

    const pipeline: PipelineStage[] = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(session.user.id),
        },
      },
      {
        $facet: {
          overallTotals: [
            {
              $group: {
                _id: null,
                income: {
                  $sum: {
                    $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
                  },
                },
                expense: {
                  $sum: {
                    $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                balance: { $subtract: ["$income", "$expense"] },
              },
            },
          ],

          periodTotals: [
            {
              $match: {
                date: { $gte: from, $lte: endOfDay(to) },
              },
            },
            {
              $group: {
                _id: null,
                income: {
                  $sum: {
                    $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
                  },
                },
                expense: {
                  $sum: {
                    $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                income: 1,
                expense: 1,
                balanceChange: { $subtract: ["$income", "$expense"] },
              },
            },
          ],
        },
      },
    ];

    const [result] = await Transaction.aggregate(pipeline);

    const overall = result?.overallTotals?.[0];
    const period = result?.periodTotals?.[0];

    const data: DashboardSummary = {
      summary: {
        available_balance: overall?.balance ?? 0,
        income: period?.income ?? 0,
        expense: period?.expense ?? 0,
        balance_change: period?.balanceChange ?? 0,
      },
    };

    return {
      success: true,
      data,
      message: "summary fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Dashboard summary fetch failed",
    };
  }
}
