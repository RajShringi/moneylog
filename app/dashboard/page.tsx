import { ExpenseBreakdownByCategory } from "@/components/charts/ExpenseBreakdownByCategory";
import IncomeExpenseTrend from "@/components/charts/IncomeExpenseTrend";
import DataTable from "@/components/table/DataTable";
import SummaryCard from "@/components/SummaryCard";
import DatePickerWithRange from "@/components/ui/DatePickerWithRange";
import {
  fetchDashboardSummary,
  fetchTransactions,
} from "@/features/transactions/actions";
import { parseDateRange } from "@/schemas/dateRangeSchema";
import { Suspense } from "react";
import { dashboardColumns } from "@/components/table/dashboard-table-column";

interface DashboardPageProps {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const { from, to } = parseDateRange({ from: params.from, to: params.to });
  const [dashboardSummaryResult, transactionsResult] = await Promise.all([
    fetchDashboardSummary(from, to),
    fetchTransactions(),
  ]);

  if (dashboardSummaryResult.success && transactionsResult.success) {
    const { incomeExpenseTrend, expenseBreakdownByCategory, summary } =
      dashboardSummaryResult.data;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Heading */}
        <div className="bg-white p-4 sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">Dashboard</h2>
        </div>

        {/* Dashboard */}
        <div className="flex flex-col gap-8 p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <Suspense fallback={<div>Loading search...</div>}>
              <DatePickerWithRange from={from} to={to} />
            </Suspense>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                amount={summary.available_balance}
                title="Current Balance"
                variant="balance"
              />

              <SummaryCard
                amount={summary.income}
                title="Income"
                from={from}
                to={to}
                variant="income"
              />

              <SummaryCard
                amount={summary.expense}
                title="Expenses"
                from={from}
                to={to}
                variant="expense"
              />

              <SummaryCard
                amount={summary.balance_change}
                title="Net Change"
                from={from}
                to={to}
                variant="change"
              />
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <IncomeExpenseTrend incomeExpenseTrend={incomeExpenseTrend} />
            </div>

            <div className="xl:col-span-1">
              <ExpenseBreakdownByCategory
                expenseBreakdownByCategory={expenseBreakdownByCategory}
                expense={summary.expense}
              />
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-bold">Recent Transactions</h4>

            <Suspense>
              <div className="overflow-x-auto">
                <DataTable
                  columns={dashboardColumns}
                  data={transactionsResult.data.transactions}
                />
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    );
  }
}
