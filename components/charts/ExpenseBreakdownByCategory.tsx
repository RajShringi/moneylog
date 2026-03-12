"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
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

import { useMemo } from "react";
import { CATEGORY_COLORS } from "@/constants";
import { CategoryColorKey } from "@/types/category.types";
import ExpenseBreakdownByCategoryToolTip from "./Tooltip/ExpenseBreakdownByCategoryToolTip";

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
        const fill = CATEGORY_COLORS[breakdown.color as CategoryColorKey].bg;

        return {
          ...breakdown,
          fill,
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
        <ResponsiveContainer width={"100%"} height={300}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 10, right: 50 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray={"4"} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) =>
                value.length > 12 ? value.slice(0, 12) + "…" : value
              }
            />
            <XAxis dataKey="total" type="number" hide />
            <Tooltip
              cursor={false}
              content={<ExpenseBreakdownByCategoryToolTip />}
            />

            <Bar dataKey="total" layout="vertical" radius={4}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="percentage"
                position="right"
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
