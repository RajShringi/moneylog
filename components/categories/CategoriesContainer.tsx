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
      <h4 className="font-medium uppercase tracking-wider flex items-center gap-2">
        <span
          className={`w-2 h-4 rounded-md 
            ${type === "income" ? "bg-lime-200" : "bg-rose-300"} 
            inline-block`}
        ></span>
        <span>{name}</span>
      </h4>
      <div>
        {categories.length === 0 ? (
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-2 h-64 w-4xl bg-neutral-100 p-4">
              <span>
                <Frown className="size-12" />
              </span>
              <span>There are no categories</span>
              <Link href="/dashboard/categories/create">
                <Button variant={"link"}>
                  <Plus className={`w-5 h-5`} />
                  <span>create new category</span>
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category._id}
                type={type}
                category={category}
              />
            ))}
            <Link
              href="/dashboard/categories/create"
              className="bg-neutral-100 flex items-center justify-center rounded-lg outline-dashed outline-2 outline-offset-1"
            >
              <Plus className={`w-5 h-5`} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
