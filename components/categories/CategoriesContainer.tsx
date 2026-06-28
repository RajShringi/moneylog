import { ICategory } from "@/types/category.types";
import CategoryCard from "./CategoryCard";
import { TransactionType } from "@/types/transaction.types";
import { Frown, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface CategoriesContainer {
  type: TransactionType;
  name: string;
  categories: ICategory[];
}

export default function CategoriesContainer({
  type,
  name,
  categories,
}: CategoriesContainer) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="flex items-center gap-2 font-medium uppercase tracking-wider">
        <span
          className={`inline-block h-4 w-2 rounded-md ${
            type === "income" ? "bg-lime-200" : "bg-rose-300"
          }`}
        />
        <span>{name}</span>
      </h4>

      {categories.length === 0 ? (
        <div className="flex items-center justify-center">
          <div className="flex min-h-65 w-full max-w-4xl flex-col items-center justify-center gap-3 rounded-lg bg-neutral-100 p-6 text-center">
            <Frown className="h-12 w-12" />

            <p>There are no categories.</p>

            <Link href="/dashboard/categories/create">
              <Button variant="link">
                <Plus className="h-5 w-5" />
                Create new category
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category._id} type={type} category={category} />
          ))}

          <Link
            href="/dashboard/categories/create"
            className="flex min-h-19 items-center justify-center rounded-lg bg-neutral-100 outline-dashed outline-2 outline-offset-1 transition-colors hover:bg-neutral-200"
          >
            <Plus className="h-5 w-5" />
          </Link>
        </div>
      )}
    </div>
  );
}
