import ManageTransactionForm from "@/components/transactions/ManageTransactionForm";
import { fetchCategories } from "@/features/categories/actions";

export default async function CreateTransactionPage() {
  const categoriesResult = await fetchCategories();
  if (categoriesResult.success) {
    return (
      <div>
        <ManageTransactionForm
          allCategories={categoriesResult.data}
          mode="create"
          transaction={null}
        />
      </div>
    );
  }
  return "Error";
}
