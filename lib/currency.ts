export function formatCurrency(amount: number) {
  const format = new Intl.NumberFormat("en-In", {
    style: "currency",
    currency: "INR",
  }).format(amount / 100);
  return format;
}

export function formatCompactCurrency(amount: number) {
  return `₹${new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount / 100)}`;
}
