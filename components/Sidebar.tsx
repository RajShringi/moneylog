"use client";
import Link from "next/link";
import { LayoutDashboard, Receipt, BarChart3 } from "lucide-react";
import { SignOut } from "./SignOut";
import { useSession } from "next-auth/react";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/categories", label: "Categories", icon: BarChart3 },
  { href: "/dashboard/transactions", label: "Transactions", icon: Receipt },
];

export default function Sidebar() {
  const session = useSession();

  return (
    <div className="flex h-full w-64 flex-col gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
      <div className="text-xl font-medium">Moneylog</div>
      <div>
        <p className="font-medium text-sm">
          Welcome{" "}
          <span className="capitalize">{session.data?.user?.username}</span>
        </p>
        <p className="text-xs text-neutral-500">{session.data?.user?.email}</p>
      </div>

      <nav>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
        <div>
          <SignOut />
        </div>
      </nav>
    </div>
  );
}
