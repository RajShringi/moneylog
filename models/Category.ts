import { TRANSACTION_TYPES } from "@/constants";
import { ICategoryDocument } from "@/types/category.types";
import { model, models, Schema } from "mongoose";

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: TRANSACTION_TYPES,
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
  { timestamps: true },
);

const Category =
  models.Category || model<ICategoryDocument>("Category", categorySchema);

export default Category;
