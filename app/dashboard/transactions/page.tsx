import { columns } from "@/components/Columns";
import DataTable from "@/components/DataTable";
import ManageTransactionForm from "@/components/ManageTransactionForm";
import TransactionSearchInput from "@/components/TransactionSearchInput";
import { fetchCategories } from "@/features/categories/actions";
import { fetchTransactions } from "@/features/transactions/actions";
import { Suspense } from "react";

interface TransactionsPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const {
    page: pageParam,
    search: searchParam,
    sortBy: sortByParam,
    sortOrder: orderParam,
  } = await searchParams;
  const currentPage = Number(pageParam) || 1;
  const search = typeof searchParam === "string" ? searchParam.trim() : "";
  const sortBy =
    sortByParam === "amount" || sortByParam === "date" ? sortByParam : "date";
  const sortOrder =
    orderParam === "asc" || orderParam === "desc" ? orderParam : "desc";

  const [categoriesResult, transactionsResult] = await Promise.all([
    fetchCategories(),
    fetchTransactions(currentPage, search, sortBy, sortOrder),
  ]);

  if (transactionsResult.success && categoriesResult.success) {
    return (
      <div>
        <p>Transactions</p>
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          <Suspense fallback={<div>Loading search...</div>}>
            <TransactionSearchInput />
          </Suspense>
          <Suspense fallback={<div>Loading table...</div>}>
            <DataTable
              columns={columns}
              data={transactionsResult.data.transactions}
              pagination={{
                currentPage,
                total: transactionsResult.data.total,
              }}
            />
          </Suspense>
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
