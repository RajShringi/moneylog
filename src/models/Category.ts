import { ICategory } from "@/types";
import { model, Schema, Model, models } from "mongoose";

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Income", "Expense"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    color: {
      type: String,
      default: "#11111",
    },
    icon: {
      type: String,
      default: "💰",
    },
  },
  { timestamps: true }
);

const Category: Model<ICategory> =
  models.Category || model<ICategory>("Category", categorySchema);

export default Category;
