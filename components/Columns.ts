"use client";
import { TransactionPreview } from "@/types/transaction.types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TransactionPreview>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ getValue }) => {
      const value = getValue() as string | Date;
      return new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "note",
    header: "Note",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];
