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
    const { balance, income, expense } = dashboardSummaryResult.data;
    return (
      <div className="flex flex-col flex-1 gap-4">
        <DatePickerWithRange from={from} to={to} />
        <div className="flex flex-col gap-2">
          <div>Date-picker</div>
          <div className="flex items-center gap-4">
            <SummaryCard
              amount={balance}
              heading="Balance"
              from={from}
              to={to}
              icon={<PiggyBank size={32} className="text-blue-400" />}
            />
            <SummaryCard
              amount={income}
              heading="Income"
              from={from}
              to={to}
              icon={<TrendingUp size={32} className="text-green-400" />}
            />
            <SummaryCard
              amount={expense}
              heading="Expense"
              from={from}
              to={to}
              icon={<TrendingDown size={32} className="text-red-400" />}
            />
          </div>
        </div>
        <div>Show chart data using range date picker(Top of the page)</div>
        <div>Show Transactions table using range date picker</div>
      </div>
    );
  }
}
