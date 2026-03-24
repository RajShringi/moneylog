import { logout } from "@/features/auth/actions";
import { LogOut } from "lucide-react";

export function SignOut() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-50 cursor-pointer"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </form>
  );
}
