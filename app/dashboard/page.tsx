import { ExpenseBreakdownByCategory } from "@/components/charts/ExpenseBreakdownByCategory";
import IncomeExpenseTrend from "@/components/charts/IncomeExpenseTrend";
import SummaryCard from "@/components/SummaryCard";
import DatePickerWithRange from "@/components/ui/DatePickerWithRange";
import { fetchDashboardSummary } from "@/features/transactions/actions";
import { parseDateRange } from "@/schemas/dateRangeSchema";
import { Suspense } from "react";

interface DashboardPageProps {
  searchParams: {
    [key: string]: string | undefined;
  };
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const { from, to } = parseDateRange({ from: params.from, to: params.to });

  const dashboardSummaryResult = await fetchDashboardSummary(from, to);

  if (dashboardSummaryResult.success) {
    const { incomeExpenseTrend, expenseBreakdownByCategory, summary } =
      dashboardSummaryResult.data;

    return (
      <div className="flex flex-col flex-1 gap-4">
        <div className="flex flex-col gap-2">
          <Suspense fallback={<div>Loading search...</div>}>
            <DatePickerWithRange from={from} to={to} />
          </Suspense>

          <div className="grid grid-cols-4 gap-4">
            <SummaryCard
              amount={summary.available_balance}
              heading="Availabe balance"
            />
            <SummaryCard
              amount={summary.income}
              heading="Income"
              from={from}
              to={to}
            />
            <SummaryCard
              amount={summary.expense}
              heading="Expense"
              from={from}
              to={to}
            />
            <SummaryCard
              amount={summary.balance_change}
              heading="Balance change"
              from={from}
              to={to}
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
        <div>Show Transactions table using range date picker</div>
      </div>
    );
  }
}
