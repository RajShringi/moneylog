import { formatCurrency } from "@/lib/currency";
import { formatChartDate } from "@/lib/date";

export default function IncomeExpenseTrendTooltip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0].payload;

  return (
    <div className="rounded-md border bg-background px-3 py-2 text-sm shadow-sm flex flex-col gap-1">
      <div>{formatChartDate(item.date)}</div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="bg-income h-4 w-1 rounded-md block"></span>
          <span className="text-muted-foreground">Income:</span>
        </div>
        <div>{formatCurrency(Number(item.income))}</div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="bg-expense h-4 w-1 rounded-md block"></span>
          <span className="text-muted-foreground">Expense:</span>
        </div>
        <div>{formatCurrency(Number(item.expense))}</div>
      </div>
    </div>
  );
}
