"use client";

import { Pencil, Trash } from "lucide-react";
import { Button } from "../ui/button";
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
} from "../ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteTransaction } from "@/features/transactions/actions";
import { toast } from "sonner";

interface TableActionsProps {
  id: string;
}

export default function TableActions({ id }: TableActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteTransaction(id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        className="cursor-pointer"
        disabled={isPending}
        onClick={() => router.push(`/dashboard/transactions/${id}/edit`)}
      >
        <span className="sr-only">edit transaction</span>
        <Pencil className="h-4 w-4" />
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="cursor-pointer" disabled={isPending}>
            <span className="sr-only">delete transaction</span>
            <Trash className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={"destructive"}
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
