"use client";

import Link from "next/link";
import { LayoutDashboard, Receipt, Tag, User, Wallet } from "lucide-react";
import { SignOut } from "./SignOut";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/categories", label: "Categories", icon: Tag },
  { href: "/dashboard/transactions", label: "Transactions", icon: Receipt },
];

export default function Sidebar() {
  const session = useSession();
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col bg-white">
      <div className="flex h-full flex-col p-4">
        {/* Logo */}
        <div className="border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-100 text-lime-800">
              <Wallet />
            </div>

            <div>
              <h2 className="text-xl font-medium">Moneylog</h2>
              <p className="text-xs text-neutral-500">Wealth Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex flex-1 flex-col justify-between">
          <div className="flex flex-col gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-lg p-2 text-sm font-semibold transition-colors hover:bg-neutral-50 hover:text-lime-800 ${
                    isActive ? "bg-lime-100 text-lime-800" : "text-neutral-500"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-neutral-200 pt-4">
            <div className="flex items-center gap-2 p-2">
              <User className="h-5 w-5 shrink-0" />

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  Welcome{" "}
                  <span className="capitalize">
                    {session.data?.user?.username}
                  </span>
                </p>

                <p className="truncate text-xs text-neutral-500">
                  {session.data?.user?.email}
                </p>
              </div>
            </div>

            <SignOut
              variant="ghost"
              className="mt-2 flex w-full items-center justify-start gap-3 rounded-lg p-2 text-sm font-semibold text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-red-600"
            />
          </div>
        </nav>
      </div>
    </aside>
  );
}
