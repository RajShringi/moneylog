export type DashboardSummary = {
  summary: {
    available_balance: number;
    income: number;
    expense: number;
    balance_change: number;
  };
  incomeExpenseTrend: {
    date: string;
    income: number;
    expense: number;
  }[];
  expenseBreakdownByCategory: {
    total: number;
    name: string;
    color: string;
  }[];
};

export type DateGroupping = "day" | "month" | "year";
