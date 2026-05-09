import { logout } from "@/features/auth/actions";
import { LogOut } from "lucide-react";

export function SignOut() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="flex w-full items-center gap-3 rounded-lg p-2 text-sm font-semibold text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-red-600 cursor-pointer"
      >
        <LogOut className="h-5 w-5" />
        Sign Out
      </button>
    </form>
  );
}
