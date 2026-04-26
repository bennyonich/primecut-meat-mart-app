import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

export async function SiteHeader() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-rose-300">
          Primecut Meat Mart
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-zinc-300">
          <Link className="hover:text-amber-200" href="/meat-sharing">
            Meat sharing
          </Link>
          <Link className="hover:text-white" href="/checkout">
            Checkout
          </Link>
          {isAdmin ? (
            <Link className="hover:text-amber-300" href="/admin">
              Admin
            </Link>
          ) : null}
          <Link className="hover:text-white" href="/login">
            Login
          </Link>
          <Link
            className="rounded-lg bg-rose-500 px-3 py-1.5 font-medium text-white hover:bg-rose-400"
            href="/register"
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
}
