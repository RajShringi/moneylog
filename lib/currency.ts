export function formatCurrency(amount: number) {
  const format = new Intl.NumberFormat("en-In", {
    style: "currency",
    currency: "INR",
  }).format(amount / 100);
  return format;
}
