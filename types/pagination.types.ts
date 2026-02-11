export interface IPagination {
  currentPage: number;
  total: number;
}

export type SortBy = "date" | "amount";
export type SortOrder = "asc" | "desc";
