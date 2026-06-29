import { CATEGORY_COLORS } from "@/constants";
import { CategoryColorKey, ICategory } from "@/types/category.types";
import CategoryCardActions from "./CategoryCardActions";
import { PiggyBank } from "lucide-react";
import { TransactionType } from "@/types/transaction.types";

interface CategoryCardProps {
  type: TransactionType;
  category: ICategory;
}

export default function CategoryCard({ type, category }: CategoryCardProps) {
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-lg bg-white p-3 shadow transition-all hover:-translate-y-1 hover:shadow-md"
      style={{
        outline: `2px solid ${
          CATEGORY_COLORS[category.color as CategoryColorKey].bg
        }`,
      }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-50">
          <PiggyBank
            className={`h-5 w-5 ${
              type === "income" ? "text-lime-300" : "text-rose-300"
            }`}
          />
        </div>

        <p className="truncate text-sm font-medium">{category.name}</p>
      </div>

      <CategoryCardActions id={category._id} />
    </div>
  );
}
