"use client";
import { TransactionPreview } from "@/types/transaction.types";
import { ColumnDef } from "@tanstack/react-table";
import SortableHeader from "./SortableHeader";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/currency";
import { CATEGORY_COLORS } from "@/constants";
import { CategoryColorKey } from "@/types/category.types";

export const columns: ColumnDef<TransactionPreview>[] = [
  {
    accessorKey: "date",
    header: () => <SortableHeader label="Date" columnKey="date" />,
    cell: ({ row }) => {
      return format(row.original.date, "dd MMM, yyyy");
    },
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category;
      if (!category) {
        return <span className="py-1 px-2 font-medium text-xs">-</span>;
      }
      return category.isArchived ? (
        <span className="text-neutral-400 text-xs py-1 px-2">
          {category.name} deleted
        </span>
      ) : (
        <span
          className="text-xs py-1 px-2 rounded-full font-medium"
          style={{
            background: CATEGORY_COLORS[category.color as CategoryColorKey].bg,
          }}
        >
          {category.name}
        </span>
      );
    },
  },
  {
    accessorKey: "note",
    header: "Note",
  },
  {
    accessorKey: "amount",
    header: () => <SortableHeader label="Amount" columnKey="amount" />,
    cell: ({ row }) => {
      return formatCurrency(row.original.amount);
    },
  },
];
