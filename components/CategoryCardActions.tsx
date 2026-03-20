"use client";
import { Archive, Pencil } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { archivedCategory } from "@/features/categories/actions";
import { toast } from "sonner";
import { useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

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
      <Button
        asChild
        disabled={isPending}
        className="cursor-pointer"
        variant={"ghost"}
      >
        <Link href={`/dashboard/categories/${id}/edit`}>
          <Pencil />
        </Link>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            className="cursor-pointer"
            disabled={isPending}
          >
            <span className="sr-only">delete transaction</span>
            <Archive className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive this category? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={"destructive"}
              onClick={handleArchive}
              disabled={isPending}
            >
              {isPending ? "Archiving..." : "Archive"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
