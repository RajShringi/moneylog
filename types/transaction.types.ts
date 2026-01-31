import { Document, Types } from "mongoose";

export type TransactionType = "income" | "expense";

export interface ITransaction {
  _id: string;
  amount: number;
  note: string;
  type: TransactionType;
  categoryId?: string;
  date: Date;
}

export interface ITransactionDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  type: TransactionType;
  categoryId?: Types.ObjectId;
  note?: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TransactionPreview = Pick<
  ITransaction,
  "_id" | "amount" | "note" | "type" | "date"
> & {
  category: string;
};

export type TransactionsPageResponse = {
  transactions: TransactionPreview[];
  total: number;
};
