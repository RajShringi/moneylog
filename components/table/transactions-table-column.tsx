"use client";
import { TransactionPreview } from "@/types/transaction.types";
import { ColumnDef } from "@tanstack/react-table";
import TableActions from "@/components/table/TableActions";
import { dashboardColumns } from "./dashboard-table-column";

export const transactionsColumns: ColumnDef<TransactionPreview>[] = [
  ...dashboardColumns,
  {
    id: "actions",
    accessorKey: "Actions",
    cell: ({ row }) => {
      return <TableActions id={row.original._id} />;
    },
  },
];
