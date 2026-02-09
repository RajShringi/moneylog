import { columns } from "@/components/Columns";
import DataTable from "@/components/DataTable";
import ManageTransactionForm from "@/components/ManageTransactionForm";
import TransactionSearchInput from "@/components/TransactionSearchInput";
import { TRANSACTIONS_PAGE_LIMIT } from "@/constants";
import { fetchCategories } from "@/features/categories/actions";
import { fetchTransactions } from "@/features/transactions/actions";

interface TransactionsPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const { page, search } = await searchParams;
  const currentPage = Number(page) || 1;
  const searchStr = typeof search === "string" ? String(search) : "";

  const [categoriesResult, transactionsResult] = await Promise.all([
    fetchCategories(),
    fetchTransactions(currentPage, searchStr),
  ]);

  if (transactionsResult.success && categoriesResult.success) {
    return (
      <div>
        <p>Transactions</p>
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          <TransactionSearchInput />
          <DataTable
            columns={columns}
            data={transactionsResult.data.transactions}
            pagination={{
              currentPage,
              pageSize: TRANSACTIONS_PAGE_LIMIT,
              total: transactionsResult.data.total,
            }}
          />
        </div>
        <div className="my-4">
          <ManageTransactionForm allCategories={categoriesResult.data} />
        </div>
      </div>
    );
  }

  // return (
  //   <div>
  //     {/* TOP */}
  //     {/* Here I am going to show charts */}
  //     {/* Bottom */}
  //     {/* Here I am going to show another component which include table to show transaction
  //     This component take transactionResult.transaction and pass it to table and in table there is
  //     pagination but as you can see fetchTransaction take page number as argument so how to implement it maybe using
  //     searchParams I don't know */}
  //     {/* {categoriesResult.success ? (
  //       <ManageTransactionForm allCategories={categoriesResult.data} />
  //     ) : (
  //       <div>Something Went Wrong</div>
  //     )} */}
  //     <p>Transactions</p>
  //     <DataTable columns={columns} data={transactionsResult.data} />
  //   </div>
  // );
}
