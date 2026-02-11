"use client";

import { ArrowDown, ArrowDownUp, ArrowUp } from "lucide-react";
import { SortOrder } from "mongoose";
import { useRouter, useSearchParams } from "next/navigation";

interface SortableHeaderProps {
  label: string;
  columnKey: string;
}

export default function SortableHeader({
  label,
  columnKey,
}: SortableHeaderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sortBy = searchParams.get("sortBy");
  const sortOrder = searchParams.get("sortOrder");

  const isActive = columnKey === sortBy;

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    let newOrder: SortOrder = "asc";

    if (isActive && sortOrder === "asc") {
      newOrder = "desc";
    }
    params.set("sortBy", columnKey);
    params.set("sortOrder", newOrder);
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  return (
    <div onClick={handleClick} className="flex items-center gap-2">
      {label}
      {isActive ? (
        <span>
          {sortOrder === "asc" ? (
            <ArrowUp size={16} />
          ) : (
            <ArrowDown size={16} />
          )}
        </span>
      ) : (
        <span>
          <ArrowDownUp size={16} />
        </span>
      )}
    </div>
  );
}
