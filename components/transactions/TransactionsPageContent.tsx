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
      <div className="flex items-center justify-between gap-6">
        <TransactionSearchInput />
        <Button variant="brand">
          <Link href="/dashboard/transactions/create">
            + create new transaction
          </Link>
        </Button>
      </div>

      <DataTable
        columns={transactionsColumns}
        data={transactions}
        pagination={{
          currentPage,
          total: total,
        }}
      />
    </div>
  );
}
