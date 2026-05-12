import { Card } from "./ui/card";
import { format } from "date-fns";
import { formatCompactCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  HandCoins,
  Landmark,
} from "lucide-react";

type Variant = "balance" | "income" | "expense" | "change";

interface SummaryCardProps {
  title: string;
  amount: number;
  variant?: Variant;
  from?: Date;
  to?: Date;
}

const icons = {
  balance: <Landmark className="w-5 h-5 text-sky-300" />,
  income: <BanknoteArrowUp className="w-5 h-5 text-lime-300" />,
  expense: <BanknoteArrowDown className="w-5 h-5 text-red-300" />,
  change: <HandCoins className="w-5 h-5 text-neutral-500" />,
};

export default function SummaryCard({
  title,
  amount,
  variant = "change",
  from,
  to,
}: SummaryCardProps) {
  const start = from ? format(from, "dd MMM") : "";
  const end = to ? format(to, "dd MMM, yyyy") : "";

  return (
    <Card
      className={cn(
        "w-full bg-white border-none rounded-2xl p-5 gap-2 transition-all hover:-translate-y-1 hover:shadow-md",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className={cn("text-sm font-medium text-neutral-500")}>{title}</p>

          <h2
            className={cn("text-3xl font-bold tracking-tight text-neutral-700")}
          >
            {formatCompactCurrency(amount)}
          </h2>
        </div>

        <div className="bg-neutral-50 size-12 flex items-center justify-center rounded-full">
          {icons[variant]}
        </div>
      </div>

      <div className={cn("text-xs text-left text-neutral-400")}>
        {from && to ? (
          <>
            {start} - {end}
          </>
        ) : (
          "All-time balance"
        )}
      </div>
    </Card>
  );
}
