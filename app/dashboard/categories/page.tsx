import CategoriesContainer from "@/components/categories/CategoriesContainer";
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
        <div className="bg-white p-4 sm:px-6">
          <h2 className="py-1 text-2xl font-bold sm:text-3xl">Categories</h2>
        </div>

        <div className="flex flex-col gap-8 p-4 sm:p-6">
          <CategoriesContainer
            type="income"
            name="Income Categories"
            categories={income}
          />

          <CategoriesContainer
            type="expense"
            name="Expense Categories"
            categories={expense}
          />
        </div>
      </div>
    );
  }
}
