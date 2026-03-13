import CategorySection from "@/components/CategorySection";
import ManageCategoryForm from "@/components/ManageCategoryForm";
import { fetchCategories } from "@/features/categories/actions";

export default async function CategoriesPage() {
  const res = await fetchCategories();
  const income = res.success
    ? res.data.filter((cat) => cat.type === "income")
    : [];
  const expense = res.success
    ? res.data.filter((cat) => cat.type === "expense")
    : [];

  if (res.success) {
    return (
      <div className="flex flex-col gap-4">
        <CategorySection title="Income" categories={income} />
        <CategorySection title="Expense" categories={expense} />
        <ManageCategoryForm />
      </div>
    );
  }
}
