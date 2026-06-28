import { fetchTransactions } from "@/features/transactions/actions";
import { redirect } from "next/navigation";
import TransactionsPageContent from "@/components/transactions/TransactionsPageContent";

interface TransactionsPageProps {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
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
      <div className="flex flex-col">
        {/* Heading */}
        <div className="bg-white p-4 sm:px-6">
          <h2 className="py-1 text-2xl font-bold sm:text-3xl">Transactions</h2>
        </div>

        {/* Content */}
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium uppercase tracking-wider sm:text-base">
              Transactions History
            </p>
          </div>

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
