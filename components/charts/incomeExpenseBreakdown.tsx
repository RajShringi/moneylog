"use client";
import { formatCompactCurrency, formatCurrency } from "@/lib/currency";
import { parse, format } from "date-fns";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface IncomeExpenseTrendProps {
  incomeExpenseTrend: {
    date: string;
    income: number;
    expense: number;
  }[];
}
export default function incomeExpenseBreakdown({
  incomeExpenseTrend,
}: IncomeExpenseTrendProps) {
  return (
    <div className="col-span-2">
      <ResponsiveContainer width={"100%"} height={300}>
        <AreaChart data={incomeExpenseTrend}>
          <defs>
            <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-income)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-income)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-expense)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-expense)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
              if (value.length === 7) {
                const date = parse(value, "yyyy-MM", new Date());
                return format(date, "MMM yyyy");
              }

              // daily data (yyyy-MM-dd)
              const date = parse(value, "yyyy-MM-dd", new Date());
              return format(date, "MMM d");
            }}
          />
          <YAxis
            tickFormatter={(value) => {
              return formatCompactCurrency(value);
            }}
          />
          <Tooltip formatter={(value: number) => formatCurrency(value)} />

          <Area
            dataKey="expense"
            type="monotone"
            fill="url(#fillExpense)"
            stroke="var(--color-expense)"
          />
          <Area
            dataKey="income"
            type="monotone"
            fill="url(#fillIncome)"
            stroke="var(--color-income)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
