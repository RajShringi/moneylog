import { auth } from "@/auth";
import { SignOut } from "@/components/SignOut";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navbar */}
      <header className="border-b border-neutral-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-100 text-lime-800">
              <Wallet />
            </div>

            <span className="text-lg font-semibold sm:text-xl">Moneylog</span>
          </div>

          {session ? (
            <div className="flex items-center gap-2">
              <Button
                variant="link"
                className="cursor-pointer hover:text-lime-800"
                asChild
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>

              <SignOut variant="brand" />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="link"
                className="cursor-pointer hover:text-lime-800"
                asChild
              >
                <Link href="/sign-in">Sign In</Link>
              </Button>

              <Button variant="brand" asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-12 sm:py-16 lg:py-24">
          <div className="max-w-4xl text-center">
            <h1 className="text-4xl font-bold leading-tight text-lime-200 sm:text-5xl lg:text-6xl">
              Track income and expenses without spreadsheets.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base text-neutral-500 sm:text-lg">
              Record every transaction, organize your finances, and understand
              where your money goes.
            </p>

            <div className="mt-8">
              <Button variant="brand" size="lg" asChild>
                <Link href="/dashboard">Start Tracking for free</Link>
              </Button>
            </div>
          </div>

          <div className="mt-12 w-full max-w-6xl">
            <Image
              src="/images/dashboard.png"
              alt="Moneylog Dashboard"
              width={1400}
              height={900}
              priority
              className="h-auto w-full rounded-xl border border-neutral-200 shadow-xl"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-100 py-6 text-center text-sm text-neutral-500">
        &copy; {new Date().getFullYear()} Moneylog. All rights reserved.
      </footer>
    </div>
  );
}
