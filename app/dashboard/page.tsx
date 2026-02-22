import SummaryCard from "@/components/SummaryCard";
import DatePickerWithRange from "@/components/ui/DatePickerWithRange";
import { fetchDashboardSummary } from "@/features/transactions/actions";
import { parseDateRange } from "@/schemas/dateRangeSchema";
import { PiggyBank, TrendingDown, TrendingUp } from "lucide-react";

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
    const { available_balance, income, expense, balance_change } =
      dashboardSummaryResult.data.summary;

    return (
      <div className="flex flex-col flex-1 gap-4">
        <div className="flex flex-col gap-2">
          <DatePickerWithRange from={from} to={to} />

          <div className="grid grid-cols-4 gap-4">
            <SummaryCard
              amount={available_balance}
              heading="Availabe balance"
            />
            <SummaryCard amount={income} heading="Income" from={from} to={to} />
            <SummaryCard
              amount={expense}
              heading="Expense"
              from={from}
              to={to}
            />
            <SummaryCard
              amount={balance_change}
              heading="Balance change"
              from={from}
              to={to}
            />
          </div>
        </div>
        <div>Show chart data using range date picker(Top of the page)</div>
        <div>Show Transactions table using range date picker</div>
      </div>
    );
  }
}
