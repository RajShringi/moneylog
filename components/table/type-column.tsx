import { TransactionPreview } from "@/types/transaction.types";
import { Row } from "@tanstack/react-table";

export default function TypeColumn({ row }: { row: Row<TransactionPreview> }) {
  const type = row.original.type;
  return (
    <span
      className={`${type === "income" ? "bg-lime-100 text-lime-800" : "bg-rose-100 text-rose-800"} py-1 px-2 
          rounded-full text-sm`}
    >
      {type}
    </span>
  );
}
