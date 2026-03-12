import { formatCurrency } from "@/lib/currency";

export default function ExpenseBreakdownByCategoryToolTip({
  active,
  payload,
}: any) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-md border bg-background px-3 py-2 text-sm shadow-sm flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1">
        <span
          className="h-4 w-1 rounded-md"
          style={{ backgroundColor: item.fill }}
        />
        <span className="text-muted-foreground">{item.name}:</span>
      </div>
      <div className="font-medium">{formatCurrency(Number(item.total))}</div>
    </div>
  );
}
