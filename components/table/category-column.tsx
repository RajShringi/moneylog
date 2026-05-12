import { CATEGORY_COLORS } from "@/constants";
import { CategoryColorKey } from "@/types/category.types";
import { TransactionPreview } from "@/types/transaction.types";
import { Row } from "@tanstack/react-table";

export default function CategoryColumn({
  row,
}: {
  row: Row<TransactionPreview>;
}) {
  const category = row.original.category;
  if (!category) {
    return <span className="py-1 px-2 font-medium text-xs">-</span>;
  }
  return category.isArchived ? (
    <span className="text-neutral-400 text-xs py-1 px-2">
      <span className="capitalize">{category.name}</span> deleted
    </span>
  ) : (
    <div>
      <span
        className="inline-block size-3 rounded-full text-sm"
        style={{
          background: CATEGORY_COLORS[category.color as CategoryColorKey].bg,
        }}
      ></span>
      <span className="py-1 px-2 rounded-full font-medium capitalize">
        {category.name}
      </span>
    </div>
  );
}
