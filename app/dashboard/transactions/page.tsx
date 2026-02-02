import { columns } from "@/components/Columns";
import DataTable from "@/components/DataTable";
import ManageTransactionForm from "@/components/ManageTransactionForm";
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
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const [categoriesResult, transactionsResult] = await Promise.all([
    fetchCategories(),
    fetchTransactions(currentPage),
  ]);

  if (transactionsResult.success && categoriesResult.success) {
    return (
      <div>
        <p>Transactions</p>
        <DataTable
          columns={columns}
          data={transactionsResult.data.transactions}
        />
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
