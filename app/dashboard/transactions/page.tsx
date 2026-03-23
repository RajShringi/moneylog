import { fetchTransactions } from "@/features/transactions/actions";
import { redirect } from "next/navigation";
import TransactionsPageContent from "@/components/transactions/TransactionsPageContent";
import Link from "next/link";

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
  const validSortBy = sortByParam === "amount" || sortByParam === "date";
  const validSortOrder = orderParam === "asc" || orderParam === "desc";
  if (!validSortBy || !validSortOrder) {
    redirect("/dashboard/transactions?sortBy=date&sortOrder=desc");
  }

  const currentPage = Number(pageParam) || 1;
  const search = typeof searchParam === "string" ? searchParam.trim() : "";
  const sortBy =
    sortByParam === "amount" || sortByParam === "date" ? sortByParam : "date";
  const sortOrder =
    orderParam === "asc" || orderParam === "desc" ? orderParam : "desc";

  const transactionsResult = await fetchTransactions(
    currentPage,
    search,
    sortBy,
    sortOrder,
  );

  if (transactionsResult.success) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <div className="flex items-center justify-between">
          <p>Transactions History</p>
          <Link href="/dashboard/transactions/create">
            create new transaction
          </Link>
        </div>
        <div>
          <TransactionsPageContent
            transactions={transactionsResult.data.transactions}
            total={transactionsResult.data.total}
            currentPage={currentPage}
          />
        </div>
      </div>
    );
  }
  return "Error";
}
