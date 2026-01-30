import Link from "next/link";
import { LayoutDashboard, Receipt, BarChart3 } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/categories", label: "Categories", icon: BarChart3 },
  { href: "/dashboard/transactions", label: "Transactions", icon: Receipt },
];

export default function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r bg-gray-50/40 px-3 py-4 dark:bg-zinc-900/50">
      <div className="mb-6 flex h-14 items-center px-4">
        <h2 className="text-lg font-bold tracking-tight">MoneyLog</h2>
      </div>
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
