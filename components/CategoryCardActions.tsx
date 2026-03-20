"use client";
import { Archive, Pencil } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { archivedCategory } from "@/features/categories/actions";
import { toast } from "sonner";
import { useTransition } from "react";

export default function CategoryCardActions({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  function handleArchive() {
    startTransition(async () => {
      try {
        const result = await archivedCategory(id);
        if (!result.success) {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  }
  return (
    <div className="flex gap-2">
      <Link href={`/dashboard/categories/${id}/edit`}>
        <Button className="cursor-pointer" variant={"ghost"}>
          <Pencil />
        </Button>
      </Link>
      <Button
        onClick={handleArchive}
        className="cursor-pointer"
        variant={"ghost"}
      >
        <Archive />
      </Button>
    </div>
  );
}
