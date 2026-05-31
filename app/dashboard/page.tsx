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
      <div className="">
        {/* heading */}
        <div className="bg-white p-4">
          <h2 className="text-3xl font-bold py-1">Dashboard</h2>
        </div>

        {/* dashboard ui */}
        <div className="flex flex-col gap-8 p-4">
          <div className="flex flex-col gap-4">
            <Suspense fallback={<div>Loading search...</div>}>
              <DatePickerWithRange from={from} to={to} />
            </Suspense>

            <div className="grid grid-cols-4 gap-4">
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
          <div className="grid grid-cols-3 gap-4">
            <IncomeExpenseTrend incomeExpenseTrend={incomeExpenseTrend} />
            <ExpenseBreakdownByCategory
              expenseBreakdownByCategory={expenseBreakdownByCategory}
              expense={summary.expense}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <h4 className="font-bold text-sm">Recent Transactions</h4>
            </div>
            <Suspense>
              <DataTable
                columns={dashboardColumns}
                data={transactionsResult.data.transactions}
              />
            </Suspense>
          </div>
        </div>
      </div>
    );
  }
}
