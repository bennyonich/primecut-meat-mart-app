"use client";

import { useState } from "react";

import { formatNaira } from "@/lib/format";

type Product = {
  id: string;
  name: string;
  priceNgnKobo: number;
  inventoryInStock: number;
  imageUrl: string | null;
};

type Meat = {
  id: string;
  title: string;
  priceNgnKobo: number;
  slotsRemaining: number | null;
  stockRemaining: number;
  imageUrl: string | null;
};

export function AdminDashboard({ products, meatShare }: { products: Product[]; meatShare: Meat[] }) {
  const [msg, setMsg] = useState("");

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10 px-6 py-10">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin</h1>
        <p className="mt-1 text-sm text-zinc-500">Update prices, stock, and image URLs. Save each row.</p>
      </div>

      {msg ? <p className="text-sm text-amber-300">{msg}</p> : null}

      <section>
        <h2 className="text-lg font-semibold text-rose-200">Per-kilogram products</h2>
        <ul className="mt-4 space-y-4">
          {products.map((p) => (
            <li key={p.id} className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
              <p className="text-sm font-medium text-zinc-300">{p.name}</p>
              <form
                className="mt-3 grid gap-2 md:grid-cols-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const res = await fetch(`/api/admin/products/${p.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      priceNgnKobo: Number(fd.get("priceNgnKobo")),
                      inventoryInStock: Number(fd.get("inventoryInStock")),
                      imageUrl: (fd.get("imageUrl") as string) || null,
                    }),
                  });
                  if (res.ok) {
                    setMsg("Saved product.");
                    setTimeout(() => setMsg(""), 2500);
                  } else {
                    setMsg("Save failed. Are you logged in as admin?");
                  }
                }}
              >
                <label className="text-xs text-zinc-500">
                  Price (kobo)
                  <input
                    className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm"
                    name="priceNgnKobo"
                    type="number"
                    min={0}
                    defaultValue={p.priceNgnKobo}
                    required
                  />
                </label>
                <label className="text-xs text-zinc-500">
                  Stock (kg)
                  <input
                    className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm"
                    name="inventoryInStock"
                    type="number"
                    min={0}
                    defaultValue={p.inventoryInStock}
                    required
                  />
                </label>
                <label className="text-xs text-zinc-500 md:col-span-2">
                  Image URL
                  <input
                    className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm"
                    name="imageUrl"
                    type="url"
                    placeholder="https://…"
                    defaultValue={p.imageUrl ?? ""}
                  />
                </label>
                <p className="text-xs text-zinc-500 md:col-span-2">
                  Display: {formatNaira(p.priceNgnKobo)} / kg
                </p>
                <button
                  className="rounded bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
                  type="submit"
                >
                  Save product
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-amber-200">Meat sharing</h2>
        <ul className="mt-4 space-y-4">
          {meatShare.map((m) => (
            <li key={m.id} className="rounded-xl border border-amber-500/20 bg-zinc-900/80 p-4">
              <p className="text-sm font-medium text-zinc-300">{m.title}</p>
              <form
                className="mt-3 grid gap-2 md:grid-cols-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const res = await fetch(`/api/admin/meat-share/${m.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      priceNgnKobo: Number(fd.get("priceNgnKobo")),
                      slotsRemaining: fd.get("slotsRemaining")
                        ? Number(fd.get("slotsRemaining"))
                        : null,
                      stockRemaining: Number(fd.get("stockRemaining")),
                      imageUrl: (fd.get("imageUrl") as string) || null,
                    }),
                  });
                  if (res.ok) {
                    setMsg("Saved meat sharing.");
                    setTimeout(() => setMsg(""), 2500);
                  } else {
                    setMsg("Save failed. Are you logged in as admin?");
                  }
                }}
              >
                <label className="text-xs text-zinc-500">
                  Price (kobo)
                  <input
                    className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm"
                    name="priceNgnKobo"
                    type="number"
                    min={0}
                    defaultValue={m.priceNgnKobo}
                    required
                  />
                </label>
                <label className="text-xs text-zinc-500">
                  Cow slots left (or 0 for non-slot)
                  <input
                    className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm"
                    name="slotsRemaining"
                    type="number"
                    min={0}
                    defaultValue={m.slotsRemaining ?? ""}
                    placeholder="—"
                  />
                </label>
                <label className="text-xs text-zinc-500">
                  Portion stock
                  <input
                    className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm"
                    name="stockRemaining"
                    type="number"
                    min={0}
                    defaultValue={m.stockRemaining}
                    required
                  />
                </label>
                <label className="text-xs text-zinc-500 md:col-span-2">
                  Image URL
                  <input
                    className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm"
                    name="imageUrl"
                    type="url"
                    placeholder="https://…"
                    defaultValue={m.imageUrl ?? ""}
                  />
                </label>
                <button
                  className="rounded bg-amber-500 px-3 py-1.5 text-sm font-medium text-zinc-950 hover:bg-amber-400 md:col-span-2"
                  type="submit"
                >
                  Save offer
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
