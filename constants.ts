export const CATEGORY_COLORS = [
  {
    value: "#ec5f7b",
    label: "#ec5f7b",
  },
  {
    value: "#a681f6",
    label: "#a681f6",
  },
  {
    value: "#f9e383",
    label: "#f9e383",
  },
  {
    value: "#75e59f",
    label: "#75e59f",
  },
  {
    value: "#e961b2",
    label: "#e961b2",
  },
] as const;

export const TRANSACTION_TYPES = ["income", "expense"] as const;
export const TRANSACTIONS_PAGE_LIMIT = 3;

export const presetDateRanges = [
  { value: "today", label: "Today" },
  { value: "this week", label: "This week" },
  { value: "this month", label: "This month" },
  { value: "this year", label: "This year" },
  { value: "last week", label: "Last week" },
  { value: "last month", label: "Last month" },
] as const;
