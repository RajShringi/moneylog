import { Pencil, Trash } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function CategoryCardActions({ id }: { id: string }) {
  return (
    <div className="flex gap-2">
      <Link href={`/dashboard/categories/${id}/edit`}>
        <Button className="cursor-pointer" variant={"ghost"}>
          <Pencil />
        </Button>
      </Link>
      <Button className="cursor-pointer" variant={"ghost"}>
        <Trash />
      </Button>
    </div>
  );
}
