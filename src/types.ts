import { Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

export interface ITransaction extends Document {
  title: string;
  amount: number;
  description?: string;
  user: Types.ObjectId;
  category: Types.ObjectId;
  type: "Income" | "Expense";
  date: Date;
}

export interface ICategory extends Document {
  name: string;
  type: "Income" | "Expense";
  user: Types.ObjectId;
  color: string;
  icon: string;
}
