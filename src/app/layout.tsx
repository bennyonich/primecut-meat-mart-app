import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Primecut Meat Mart",
  description: "Production-ready MVP for meat ordering in Nigeria (NGN).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
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
        {children}
      </body>
    </html>
  );
}
