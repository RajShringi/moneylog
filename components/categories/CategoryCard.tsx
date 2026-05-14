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
      className="flex items-center justify-between py-2 px-2 bg-white shadow rounded-lg 
      transition-all hover:-translate-y-1 hover:shadow-md"
      style={{
        outline: `2px solid ${CATEGORY_COLORS[category.color as CategoryColorKey].bg}`,
      }}
    >
      <div className="flex items-center gap-4">
        <div className="bg-neutral-50 size-12 flex items-center justify-center rounded-full">
          <PiggyBank
            className={`w-5 h-5 ${type === "income" ? "text-lime-300" : "text-rose-300"}`}
          />
        </div>
        <div className="text-sm">{category.name}</div>
      </div>
      <CategoryCardActions id={category._id} />
    </div>
  );
}
