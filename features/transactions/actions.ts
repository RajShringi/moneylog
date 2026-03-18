"use server";

import { auth } from "@/auth";
import { TRANSACTIONS_PAGE_LIMIT } from "@/constants";
import { getDateGranularity } from "@/lib/date";
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
  ITransaction,
  ITransactionDocument,
  TransactionPreview,
  TransactionsPageResponse,
} from "@/types/transaction.types";
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  endOfDay,
  format,
} from "date-fns";
import mongoose from "mongoose";
import { PipelineStage } from "mongoose";
import { revalidatePath } from "next/cache";

// create Transaction
export async function createTransaction(
  data: transactionInput,
): Promise<ActionResult<null>> {
  try {
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
    const amount = Math.round(Number(data.amount) * 100);
    const transaction = new Transaction({
      userId: session.user.id,
      amount,
      type: data.type,
      categoryId: data.categoryId || null,
      note: data.note || "",
      date: data.date,
    });

    await transaction.save();
    revalidatePath("/dashboard/transactions");
    return {
      success: true,
      data: null,
      message: "Transaction created successfully",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error creating trasaction",
    };
  }
}

// edit Transaction
export async function editTransaction(
  transactionId: string,
  data: transactionInput,
): Promise<ActionResult<null>> {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "User is not logged-in" };
    }

    const validated = transactionSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: "Invalid data" };
    }

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return { success: false, error: "Transaction not found" };
    }

    // Authorization check
    if (transaction.userId.toString() !== session.user.id) {
      return { success: false, error: "Unauthorized" };
    }

    const amount = Math.round(Number(validated.data.amount) * 100);
    transaction.categoryId = validated.data.categoryId || null;
    transaction.amount = amount;
    transaction.note = validated.data.note || "";
    transaction.date = validated.data.date;
    transaction.type = validated.data.type;
    await transaction.save();
    revalidatePath("/dashboard/transactions");

    return {
      success: true,
      data: null,
      message: "Transaction updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error editing transaction",
    };
  }
}

// fetch transactions by limit
export async function fetchTransactions(
  page: number = 1,
  search: string = "",
  sortBy: SortBy = "date",
  sortOrder: SortOrder = "desc",
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
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
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
        category: transaction.category
          ? {
              name: transaction.category.name,
              isArchived: transaction.category.isArchived,
              color: transaction.category.color,
            }
          : null,
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

// fetch single transaction
export async function fetchTransactionById({
  id,
}: {
  id: string;
}): Promise<ActionResult<ITransaction>> {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "User is not logged-in" };
    }
    await dbConnect();
    const transaction =
      await Transaction.findById(id).lean<ITransactionDocument>();
    if (!transaction) {
      return {
        success: false,
        error: "Transaction not found",
      };
    }

    const serializeTransaction: ITransaction = {
      _id: transaction._id.toString(),
      amount: transaction.amount,
      date: transaction.date,
      note: transaction.note || "",
      type: transaction.type,
      categoryId: transaction.categoryId?.toString(),
    };
    return {
      success: true,
      data: serializeTransaction,
      message: "Transaction fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Transaction fetch failed",
    };
  }
}

// fetch dashboard summary
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

    const granularity = getDateGranularity(from, to);
    let formatIncomeExpenseTrend = "%Y";
    if (granularity === "month" || granularity === "day") {
      formatIncomeExpenseTrend += "-%m";
    }
    if (granularity === "day") {
      formatIncomeExpenseTrend += "-%d";
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
          incomeExpenseTrend: [
            {
              $match: {
                date: { $gte: from, $lte: endOfDay(to) },
              },
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: formatIncomeExpenseTrend,
                    date: "$date",
                  },
                },
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
          ],
          ExpenseBreakdownByCategory: [
            {
              $match: {
                date: { $gte: from, $lte: endOfDay(to) },
                type: "expense",
              },
            },
            {
              $limit: 5,
            },
            {
              $group: {
                _id: "$categoryId",
                total: { $sum: "$amount" },
              },
            },
            {
              $lookup: {
                from: "categories",
                localField: "_id",
                foreignField: "_id",
                pipeline: [{ $match: { isArchived: false } }],
                as: "category",
              },
            },
            {
              $unwind: {
                path: "$category",
              },
            },
            {
              $sort: { total: -1 },
            },
            {
              $project: {
                _id: 0,
                total: 1,
                color: "$category.color",
                name: "$category.name",
              },
            },
          ],
        },
      },
    ];

    const [result] = await Transaction.aggregate(pipeline);
    const map = new Map<string, { income: number; expense: number }>();

    const overall = result?.overallTotals?.[0];
    const period = result?.periodTotals?.[0];
    const trend = result?.incomeExpenseTrend;
    const breakdown = result?.ExpenseBreakdownByCategory;

    trend.forEach((t: any) => {
      map.set(t._id, { income: t.income, expense: t.expense });
    });

    let intervals: Date[] = [];

    if (granularity === "year") {
      intervals = eachYearOfInterval({ start: from, end: to });
    } else if (granularity === "month") {
      intervals = eachMonthOfInterval({ start: from, end: to });
    } else if (granularity === "day") {
      intervals = eachDayOfInterval({
        start: from,
        end: to,
      });
    }

    const finalData = intervals.map((date) => {
      let key: string;

      if (granularity === "day") {
        key = format(date, "yyyy-MM-dd");
      } else if (granularity === "month") {
        key = format(date, "yyyy-MM");
      } else {
        key = format(date, "yyyy");
      }

      return {
        date: key,
        income: map.get(key)?.income ?? 0,
        expense: map.get(key)?.expense ?? 0,
      };
    });

    const data: DashboardSummary = {
      summary: {
        available_balance: overall?.balance ?? 0,
        income: period?.income ?? 0,
        expense: period?.expense ?? 0,
        balance_change: period?.balanceChange ?? 0,
      },
      incomeExpenseTrend: finalData,
      expenseBreakdownByCategory: breakdown,
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

// delete transaction
export async function deleteTransaction(
  id: string,
): Promise<ActionResult<null>> {
  try {
    await dbConnect();
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "user is not logged-in" };
    }
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return { success: false, error: "Transaction not found" };
    }
    if (transaction.userId.toString() !== session.user.id) {
      return { success: false, error: "Unauthorized" };
    }
    await transaction.deleteOne();
    revalidatePath("/dashboard/transactions");
    return {
      success: true,
      data: null,
      message: "Transaction deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Transaction delete failed",
    };
  }
}
