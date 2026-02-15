import { ReactNode } from "react";
import { Card } from "./ui/card";
import { format } from "date-fns";

interface SummaryCardProps {
  heading: "Balance" | "Income" | "Expense";
  amount: number;
  from: Date;
  to: Date;
  icon: ReactNode;
}

export default function SummaryCard({
  heading,
  amount,
  from,
  to,
  icon,
}: SummaryCardProps) {
  const start = format(from, "dd MMM");
  const end = format(to, "dd MMM, yyyy");

  return (
    <Card className="w-full max-w-sm px-4">
      <div className="flex items-center justify-between flex-wrap">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold">{heading}</h3>
          <p className="text-sm text-gray-500">
            <span>{start}</span> - <span>{end}</span>
          </p>
        </div>
        <div>{icon}</div>
      </div>
      <div className="text-2xl font-bold">${amount}</div>
    </Card>
  );
}
