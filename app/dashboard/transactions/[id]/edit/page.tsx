import ManageTransactionForm from "@/components/transactions/ManageTransactionForm";
import { fetchCategories } from "@/features/categories/actions";
import { fetchTransactionById } from "@/features/transactions/actions";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categoriesResult, transactionResult] = await Promise.all([
    fetchCategories(),
    fetchTransactionById({ id }),
  ]);

  if (categoriesResult.success && transactionResult.success) {
    return (
      <div>
        <ManageTransactionForm
          allCategories={categoriesResult.data}
          mode="edit"
          transaction={transactionResult.data}
        />
      </div>
    );
  }
}
