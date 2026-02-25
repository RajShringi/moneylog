import { Document, Types } from "mongoose";
import { TransactionType } from "./transaction.types";

export interface ICategory {
  _id: string;
  name: string;
  type: TransactionType;
  color?: string;
  isArchived: boolean;
}

export interface ICategoryDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  type: TransactionType;
  userId: Types.ObjectId;
  color?: string;
  isArchived: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
