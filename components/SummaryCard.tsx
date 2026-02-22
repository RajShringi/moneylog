import { ReactNode } from "react";
import { Card } from "./ui/card";
import { format } from "date-fns";

interface SummaryCardProps {
  heading: "Availabe balance" | "Income" | "Expense" | "Balance change";
  amount: number;
  from?: Date;
  to?: Date;
}

export default function SummaryCard({
  heading,
  amount,
  from,
  to,
}: SummaryCardProps) {
  const start = from ? format(from, "dd MMM") : "";
  const end = to ? format(to, "dd MMM, yyyy") : "";

  return (
    <Card className="w-full max-w-sm px-4">
      <div>
        <h3 className="text-xl font-bold">{heading}</h3>
        <div className="text-2xl font-bold">${amount}</div>
      </div>
      <p className="text-sm text-gray-500">
        {from && to ? (
          <>
            <span>{start}</span> - <span>{end}</span>
          </>
        ) : (
          <span>All-time balance</span>
        )}
      </p>
    </Card>
  );
}
