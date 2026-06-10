import { logout } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { ComponentProps } from "react";

type SignOutProps = ComponentProps<typeof Button>;

export function SignOut({
  className,
  variant = "ghost",
  size = "default",
  ...props
}: SignOutProps) {
  return (
    <form action={logout}>
      <Button
        type="submit"
        variant={variant}
        size={size}
        className={className}
        {...props}
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </form>
  );
}
