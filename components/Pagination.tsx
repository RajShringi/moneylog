"use client";

import { Button } from "./ui/button";
import { IPagination } from "@/types/pagination.types";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  pagination: IPagination;
  pageCount: number;
}

export default function Pagination({ pagination, pageCount }: PaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", `${page}`);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(pagination.currentPage - 1)}
        disabled={pagination.currentPage === 1}
      >
        Prev
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(pagination.currentPage + 1)}
        disabled={pagination.currentPage === pageCount}
      >
        Next
      </Button>
    </div>
  );
}
