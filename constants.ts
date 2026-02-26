export const CATEGORY_COLORS = {
  "color-1": {
    bg: "oklch(88.5% 0.062 18.334)",
    text: "oklch(63.7% 0.237 25.331)",
  },
  "color-2": {
    bg: "oklch(94.5% 0.129 101.54)",
    text: "oklch(79.5% 0.184 86.047)",
  },
  "color-3": {
    bg: "oklch(93.8% 0.127 124.321)",
    text: "oklch(76.8% 0.233 130.85)",
  },
  "color-4": {
    bg: "oklch(87% 0.065 274.039)",
    text: "oklch(67.3% 0.182 276.935)",
  },
  "color-5": {
    bg: "oklch(90.3% 0.076 319.62)",
    text: "oklch(74% 0.238 322.16)",
  },
  "color-6": {
    bg: "oklch(91% 0.096 180.426)",
    text: "oklch(77.7% 0.152 181.912)",
  },
} as const;

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
