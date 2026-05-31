"use client";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TransactionSearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState<string>(
    searchParams.get("search") ?? "",
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  function updateSearchParams() {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.replace(`?${params.toString()}`);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateSearchParams();
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [search]);

  return (
    <Input
      type="text"
      name="search"
      value={search}
      onChange={handleSearch}
      placeholder="Search transactions by note and category..."
      className="bg-white border border-lime-200 focus-visible:ring-lime-200"
    />
  );
}
