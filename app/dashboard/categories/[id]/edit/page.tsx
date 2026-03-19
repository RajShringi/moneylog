import ManageCategoryForm from "@/components/ManageCategoryForm";
import { fetchCategoryById } from "@/features/categories/actions";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;
  const categoryResult = await fetchCategoryById(id);
  if (categoryResult.success) {
    return <ManageCategoryForm mode="edit" category={categoryResult.data} />;
  }
  return <>Error</>;
}
