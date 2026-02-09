"use client";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";

export default function TransactionSearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState<string>(
    searchParams.get("search") ?? "",
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const debounceSearch = useDebounce(search);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debounceSearch) {
      params.set("search", debounceSearch);
      params.set("page", "1");
    } else {
      params.delete("search");
      params.delete("page");
    }
    router.push(`?${params.toString()}`);
  }, [debounceSearch]);

  return (
    <Input
      type="text"
      name="search"
      value={search}
      onChange={handleSearch}
      placeholder="Search transactions..."
    />
  );
}
