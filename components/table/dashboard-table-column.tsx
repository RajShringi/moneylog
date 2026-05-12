"use client";
import { TransactionPreview } from "@/types/transaction.types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/currency";
import SortableHeader from "@/components/table/SortableHeader";
import TypeColumn from "./type-column";
import CategoryColumn from "./category-column";

export const dashboardColumns: ColumnDef<TransactionPreview>[] = [
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
    cell: ({ row }) => <TypeColumn row={row} />,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <CategoryColumn row={row} />,
  },
  {
    accessorKey: "note",
    header: "Note",
  },
  {
    accessorKey: "amount",
    header: () => <SortableHeader label="Amount" columnKey="amount" />,
    cell: ({ row }) => {
      return (
        <span className={`font-bold`}>
          {formatCurrency(row.original.amount)}
        </span>
      );
    },
  },
];
