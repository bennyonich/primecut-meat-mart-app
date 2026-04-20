import { db } from "@/lib/db";
import { formatNaira } from "@/lib/format";
import { starterProducts } from "@/lib/seed-data";

export default async function Home() {
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

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-8">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-3xl font-bold">Primecut Meat Mart</h1>
        <p className="mt-2 text-zinc-300">
          Production MVP for meat ordering in Nigeria. Currency is set to NGN and checkout is
          ready for Paystack initialization.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Catalog</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {visibleProducts.map((product) => (
            <article key={product.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-400">{product.category}</p>
              <h3 className="mt-1 text-lg font-semibold">{product.name}</h3>
              <p className="mt-2 text-sm text-zinc-300">{product.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-semibold">{formatNaira(product.priceNgnKobo)}</span>
                <span className="text-sm text-zinc-400">Stock: {product.inventoryInStock}</span>
              </div>
              <p className="mt-2 text-sm text-zinc-400">
                Rating: {product.rating ? product.rating.toFixed(1) : "No reviews yet"}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <a className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:bg-zinc-800" href="/checkout">
          Cart + Checkout
        </a>
        <a className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:bg-zinc-800" href="/orders">
          Track Orders
        </a>
        <a className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:bg-zinc-800" href="/subscriptions">
          Meat Subscriptions
        </a>
        <a className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:bg-zinc-800" href="/support-chat">
          Buyer Support Chat
        </a>
      </section>
    </main>
  );
}
