import Link from "next/link";

import { db } from "@/lib/db";
import { formatNaira } from "@/lib/format";
import { meatShareSeedOfferings } from "@/lib/meat-share-seed";
import { starterProducts } from "@/lib/seed-data";

export default async function Home() {
  const meatShare = await db.meatShareOffering
    .findMany({
      where: { isActive: true },
      orderBy: [{ animal: "asc" }, { kind: "asc" }],
    })
    .catch(() => []);

  const products = await db.product
    .findMany({
      where: { isActive: true },
      include: { category: true, reviews: true },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  const visibleProducts =
    products.length > 0
      ? products.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          category: product.category.name,
          inventoryInStock: product.inventoryInStock,
          priceNgnKobo: product.priceNgnKobo,
          rating:
            product.reviews.length > 0
              ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
              : null,
        }))
      : starterProducts.map((item, idx) => ({
          id: `seed-${idx}`,
          ...item,
          rating: null as number | null,
        }));

  const sharingRows =
    meatShare.length > 0
      ? meatShare
      : meatShareSeedOfferings.map((row, i) => ({
          id: `seed-ms-${i}`,
          title: row.title,
          description: row.description,
          animal: row.animal,
          kind: row.kind,
          totalSlots: row.totalSlots,
          slotsRemaining: row.slotsRemaining,
          stockRemaining: row.stockRemaining,
          priceNgnKobo: row.priceNgnKobo,
        }));

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-8">
      <section className="rounded-3xl border border-rose-300/30 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-400 p-8 text-white shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Fresh cuts daily</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Primecut Meat Mart</h1>
        <p className="mt-3 max-w-2xl text-white/90">
          Premium meat shopping experience with same-day options, easy checkout, and trusted quality.
        </p>
      </section>

      <section className="rounded-3xl border border-amber-400/25 bg-gradient-to-br from-amber-950/80 via-zinc-900 to-zinc-950 p-8 shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/90">Featured</p>
            <h2 className="mt-1 text-3xl font-bold text-white">Meat sharing</h2>
            <p className="mt-2 max-w-2xl text-zinc-400">
              Pool a full cow in <strong className="text-amber-300">10 slots</strong>, or buy{" "}
              <strong className="text-rose-300">half</strong> and <strong className="text-rose-300">quarter</strong>{" "}
              ram and goat portions — priced for families and sharing.
            </p>
          </div>
          <Link
            className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-400 to-rose-500 px-6 py-3 text-base font-semibold text-zinc-950 shadow-lg hover:from-amber-300 hover:to-rose-400"
            href="/meat-sharing"
          >
            Browse sharing options
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sharingRows.slice(0, 3).map((row) => (
            <article
              key={row.id}
              className="rounded-2xl border border-amber-500/20 bg-zinc-950/60 p-4"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-amber-200/90">
                {row.kind === "COW_SLOT"
                  ? "Cow · slots"
                  : `${row.animal} · ${row.kind === "HALF" ? "Half" : "Quarter"}`}
              </p>
              <h3 className="mt-1 text-lg font-bold text-white">{row.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-500">{row.description}</p>
              <p className="mt-3 font-semibold text-amber-300">{formatNaira(row.priceNgnKobo)}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-2xl font-semibold text-rose-200">Per-kilogram catalog</h2>
        <p className="mb-4 text-sm text-zinc-400">
          Buy cow, goat, ram, chicken, and turkey by kilogram.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {visibleProducts.map((product) => (
            <article
              key={product.id}
              className="rounded-2xl border border-rose-200/20 bg-gradient-to-b from-zinc-900 to-zinc-950 p-5 shadow-lg shadow-rose-900/10 transition hover:-translate-y-0.5 hover:border-rose-300/50"
            >
              <p className="inline-flex rounded-full bg-rose-500/20 px-3 py-1 text-xs font-medium uppercase tracking-wide text-rose-200">
                {product.category}
              </p>
              <h3 className="mt-3 text-xl font-bold text-white">{product.name}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-300">{product.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-amber-300">{formatNaira(product.priceNgnKobo)}</span>
                <span className="rounded bg-zinc-800 px-2 py-1 text-sm text-zinc-200">
                  Stock: {product.inventoryInStock}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-400">
                Rating: {product.rating ? product.rating.toFixed(1) : "No reviews yet"}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Link
          className="rounded-xl border border-amber-300/40 bg-amber-500/20 p-4 font-medium text-amber-100 transition hover:bg-amber-500/30"
          href="/meat-sharing"
        >
          Meat sharing
        </Link>
        <a
          className="rounded-xl border border-emerald-300/30 bg-emerald-500/15 p-4 font-medium text-emerald-200 transition hover:bg-emerald-500/25"
          href="/checkout"
        >
          Cart + Checkout
        </a>
        <a
          className="rounded-xl border border-sky-300/30 bg-sky-500/15 p-4 font-medium text-sky-200 transition hover:bg-sky-500/25"
          href="/orders"
        >
          Track Orders
        </a>
        <a
          className="rounded-xl border border-violet-300/30 bg-violet-500/15 p-4 font-medium text-violet-200 transition hover:bg-violet-500/25"
          href="/subscriptions"
        >
          Meat Subscriptions
        </a>
        <a
          className="rounded-xl border border-amber-300/30 bg-amber-500/15 p-4 font-medium text-amber-200 transition hover:bg-amber-500/25"
          href="/support-chat"
        >
          Buyer Support Chat
        </a>
      </section>
    </main>
  );
}
