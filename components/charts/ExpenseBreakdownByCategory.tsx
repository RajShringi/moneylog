"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/currency";
import { useMemo } from "react";
import { CATEGORY_COLORS } from "@/constants";
import { CategoryColorKey } from "@/types/category.types";

export const description = "A bar chart with a custom label";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-2)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig;

interface ExpenseBreakdownByCategoryProps {
  expenseBreakdownByCategory: {
    total: number;
    name: string;
    color: string;
  }[];
  expense: number;
}

export function ExpenseBreakdownByCategory({
  expenseBreakdownByCategory,
  expense,
}: ExpenseBreakdownByCategoryProps) {
  const chartData = useMemo(
    () =>
      expenseBreakdownByCategory.map((breakdown) => {
        return {
          ...breakdown,
          percentage: `${((breakdown.total / expense) * 100).toFixed(2)}%`,
        };
      }),
    [expense, expenseBreakdownByCategory],
  );

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Expense Breakdown by Category</CardTitle>
        <CardDescription className="text-pretty">
          Percentage contribution of each category to total spending.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="min-h-75 w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 50,
              left: 10,
            }}
          >
            <CartesianGrid horizontal={false} strokeDasharray={"4"} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
              // hide
            />
            <XAxis dataKey="total" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value) => [formatCurrency(Number(value))]}
                />
              }
            />

            <Bar
              dataKey="total"
              layout="vertical"
              fill="var(--color-expense)"
              radius={4}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={CATEGORY_COLORS[entry.color as CategoryColorKey].bg}
                />
              ))}

              <LabelList
                dataKey="percentage"
                position="right"
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
