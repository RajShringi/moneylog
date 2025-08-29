import { ITransaction } from "@/types";
import { Model, model, models, Schema } from "mongoose";

const transactionSchema = new Schema<ITransaction>(
  {
    title: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    type: {
      type: String,
      enum: ["Income", "Expense"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Transaction: Model<ITransaction> =
  models.Transaction || model("Transaction", transactionSchema);

export default Transaction;
