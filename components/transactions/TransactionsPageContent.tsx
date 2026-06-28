import { transactionsColumns } from "@/components/table/transactions-table-column";
import DataTable from "../table/DataTable";
import TransactionSearchInput from "./TransactionSearchInput";
import { TransactionPreview } from "@/types/transaction.types";
import Link from "next/link";
import { Button } from "../ui/button";

export default function TransactionsPageContent({
  transactions,
  total,
  currentPage,
}: {
  transactions: TransactionPreview[];
  total: number;
  currentPage: number;
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Search & Create */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-md">
          <TransactionSearchInput />
        </div>

        <Button variant="brand" className="w-full sm:w-auto" asChild>
          <Link href="/dashboard/transactions/create">
            + Create New Transaction
          </Link>
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <DataTable
          columns={transactionsColumns}
          data={transactions}
          pagination={{
            currentPage,
            total,
          }}
        />
      </div>
    </div>
  );
}
