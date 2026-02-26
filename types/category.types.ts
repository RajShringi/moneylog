import { Document, Types } from "mongoose";
import { TransactionType } from "./transaction.types";
import { CATEGORY_COLORS } from "@/constants";

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

export type CategoryColorKey = keyof typeof CATEGORY_COLORS;
