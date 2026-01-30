import ManageTransactionForm from "@/components/ManageTransactionForm";
import { fetchCategories } from "@/features/categories/actions";

export default async function TransactionsPage() {
  const categoriesResult = await fetchCategories();

  return (
    <div>
      {categoriesResult.success ? (
        <ManageTransactionForm allCategories={categoriesResult.data} />
      ) : (
        <div>Something Went Wrong</div>
      )}
    </div>
  );
}
