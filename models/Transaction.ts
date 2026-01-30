import { TRANSACTION_TYPES } from "@/constants";
import { ITransactionDocument } from "@/types/transaction.types";
import { model, models, Schema } from "mongoose";

const transactionSchema = new Schema<ITransactionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: TRANSACTION_TYPES,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    note: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

const Transaction =
  models.Transaction ||
  model<ITransactionDocument>("Transaction", transactionSchema);

export default Transaction;
