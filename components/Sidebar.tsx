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
    <div className="flex h-full w-64 flex-col gap-4 p-4 bg-white">
      <div className="flex flex-col gap-2 border-b border-neutral-200 py-2">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-lime-100 text-lime-800 flex items-center justify-center">
            <Wallet />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-medium ">Moneylog</span>
            <span className="text-xs text-neutral-500">Wealth Managment</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg p-2 text-sm font-semibold  transition-colors hover:bg-neutral-50 
                  hover:text-lime-800 ${isActive ? "bg-lime-100 text-lime-800" : "text-neutral-500"}`}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="flex flex-col gap-2 border-t border-neutral-200">
          <div className="flex items-center gap-2 p-2">
            <User className="h-5 w-5" />
            <div>
              <p className="font-medium text-sm">
                Welcome{" "}
                <span className="capitalize">
                  {session.data?.user?.username}
                </span>
              </p>
              <p className="text-xs text-neutral-500">
                {session.data?.user?.email}
              </p>
            </div>
          </div>
          <SignOut
            variant={"ghost"}
            className="flex w-full items-start justify-start gap-3 rounded-lg p-2 text-sm font-semibold text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-red-600 cursor-pointer"
          />
        </div>
      </nav>
    </div>
  );
}
