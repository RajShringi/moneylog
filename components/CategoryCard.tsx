import { CATEGORY_COLORS } from "@/constants";
import { CategoryColorKey, ICategory } from "@/types/category.types";
import CategoryCardActions from "./CategoryCardActions";

interface CategorySectionProps {
  title: string;
  categories: ICategory[];
}

export default function CategoryCard({
  title,
  categories,
}: CategorySectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="font-medium">{title}</h4>
      {categories.length === 0 ? (
        <div className="text-center font-bold text-lg">
          There are no categories
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-2">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center justify-between py-2 px-4 shadow bg-white rounded-lg"
              style={{
                borderLeft: `5px solid ${CATEGORY_COLORS[cat.color as CategoryColorKey].bg}`,
              }}
            >
              <div className="flex items-center gap-1">
                <div>{cat.name}</div>
              </div>
              <CategoryCardActions id={cat._id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
