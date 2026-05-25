"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
    <Card className="col-span-1 border-none">
      <CardHeader>
        <CardTitle className="text-neutral-700">
          Expense Breakdown by Category
        </CardTitle>
        <CardDescription className="text-pretty">
          Percentage contribution of each category to total spending.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width={"100%"} height={290}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ top: 10, bottom: 10 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray={"4"} />
            <YAxis type="category" hide />
            <XAxis dataKey="total" type="number" hide />
            <Tooltip
              cursor={false}
              content={<ExpenseBreakdownByCategoryToolTip />}
            />

            <Bar dataKey="total" layout="vertical" radius={5} barSize={15}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-4 flex-wrap">
          {expenseBreakdownByCategory.map((category) => {
            const bg = CATEGORY_COLORS[category.color as CategoryColorKey].bg;
            return (
              <div key={category.name} className="flex items-center gap-2">
                <div
                  className={`size-3 rounded-full`}
                  style={{ backgroundColor: bg }}
                ></div>
                <div className="text-xs">{category.name}</div>
              </div>
            );
          })}
        </div>
      </CardFooter>
    </Card>
  );
}
