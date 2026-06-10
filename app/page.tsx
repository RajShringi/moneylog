import { auth } from "@/auth";
import { SignOut } from "@/components/SignOut";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col gap-12 bg-white min-h-screen">
      {/* Navbar */}
      <div className="p-4 border-b border-neutral-100 bg-white">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-lime-100 text-lime-800 flex items-center justify-center">
              <Wallet />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-medium ">Moneylog</span>
            </div>
          </div>

          <div>
            {session ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500">
                  <Button
                    variant="link"
                    className="cursor-pointer hover:text-lime-800"
                  >
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                </span>
                <SignOut variant={"brand"} />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href={"/sign-in"}>
                  <Button
                    variant="link"
                    className="cursor-pointer hover:text-lime-800"
                  >
                    Sign In
                  </Button>
                </Link>

                <Link href={"/sign-up"}>
                  <Button
                    variant="brand"
                    className="cursor-pointer hover:text-lime-800"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Hero */}
      <div className="max-w-3xl w-full mx-auto py-4">
        <div className="text-center text-pretty space-y-6">
          <div className="flex flex-col gap-6  p-4 rounded-lg">
            <h1 className="text-6xl font-bold text-lime-200">
              Track income and expenses without spreadsheets.
            </h1>
            <p className="text-lg text-neutral-500 mt-4">
              Record every transaction, organize your finances, and understand
              where your money goes.
            </p>
            <Link href="/dashboard" className="inline-block">
              <Button variant={"brand"}>Start Tracking for free</Button>
            </Link>
          </div>

          <div className=" rounded-lg p-2">
            <Image
              src="/images/dashboard.png"
              alt="Dashboard"
              width={800}
              height={600}
              className="mask-l-from-90% mask-r-from-70%"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div>
        <div className="border-t border-neutral-100 bg-white py-4 text-center text-sm text-neutral-500 ">
          &copy; {new Date().getFullYear()} Moneylog. All rights reserved.
        </div>
      </div>
    </div>
  );
}
