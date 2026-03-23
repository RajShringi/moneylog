import { transactionsColumns } from "@/features/transactions/table/transactions-table-column";
import DataTable from "../table/DataTable";
import TransactionSearchInput from "./TransactionSearchInput";
import { TransactionPreview } from "@/types/transaction.types";

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
      <TransactionSearchInput />

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
