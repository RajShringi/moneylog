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
        <div className="bg-white p-4">
          <h2 className="text-3xl font-bold py-1">Categories</h2>
        </div>

        <div className="p-4 flex flex-col gap-8">
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
