import { Document, model, models, Schema, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  type: "income" | "expense";
  userId: Types.ObjectId;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    color: {
      type: String,
    },
  },
  { timestamps: true }
);

const Category =
  models.Category || model<ICategory>("Category", categorySchema);

export default Category;
