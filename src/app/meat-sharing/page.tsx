"use client";

import { useEffect, useMemo, useState } from "react";

import { formatNaira } from "@/lib/format";

type Offering = {
  id: string;
  title: string;
  description: string;
  animal: string;
  kind: string;
  totalSlots: number | null;
  slotsRemaining: number | null;
  stockRemaining: number;
  priceNgnKobo: number;
};

export default function MeatSharingPage() {
  const [rows, setRows] = useState<Offering[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliverySlot, setDeliverySlot] = useState("Tomorrow 9AM-12PM");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/meat-share")
      .then((r) => r.json())
      .then((data: { offerings?: Offering[] }) => {
        const list = data.offerings ?? [];
        setRows(list);
        const initQty: Record<string, number> = {};
        const initSel: Record<string, boolean> = {};
        for (const o of list) {
          initQty[o.id] = 1;
          initSel[o.id] = false;
        }
        setQuantities(initQty);
        setSelected(initSel);
      })
      .catch(() => undefined);
  }, []);

  const cow = useMemo(() => rows.find((r) => r.kind === "COW_SLOT"), [rows]);
  const portions = useMemo(() => rows.filter((r) => r.kind !== "COW_SLOT"), [rows]);

  const setQty = (id: string, value: number) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-8">
      <header className="rounded-3xl border border-amber-300/30 bg-gradient-to-br from-amber-900/40 via-rose-900/30 to-zinc-950 p-8 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-200/90">
          Group buy
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white">Meat sharing</h1>
        <p className="mt-3 max-w-3xl text-lg text-zinc-300">
          Share a full cow across <strong className="text-amber-300">10 slots</strong>, or choose{" "}
          <strong className="text-rose-300">half</strong> or <strong className="text-rose-300">quarter</strong>{" "}
          ram or goat — main cuts for households and communities.
        </p>
      </header>

      {cow ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-amber-200">Cow — shared slots</h2>
          <article className="rounded-2xl border border-amber-400/30 bg-zinc-900/80 p-6 shadow-lg">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-1 items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-amber-400 text-amber-500"
                  checked={selected[cow.id] ?? false}
                  onChange={(e) => setSelected((s) => ({ ...s, [cow.id]: e.target.checked }))}
                />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-amber-300">Full cow</p>
                  <h3 className="mt-1 text-2xl font-bold text-white">{cow.title}</h3>
                  <p className="mt-2 max-w-2xl text-zinc-400">{cow.description}</p>
                  <p className="mt-3 text-sm text-zinc-500">
                    Slots left:{" "}
                    <span className="font-semibold text-amber-200">{cow.slotsRemaining ?? 0}</span> /{" "}
                    {cow.totalSlots ?? 10}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 md:items-end">
                <p className="text-2xl font-bold text-amber-300">{formatNaira(cow.priceNgnKobo)}</p>
                <p className="text-xs text-zinc-500">per slot</p>
                <label className="flex items-center gap-2 text-sm text-zinc-300">
                  Slots
                  <input
                    className="w-20 rounded border border-zinc-700 bg-zinc-950 px-2 py-1"
                    type="number"
                    min={1}
                    max={cow.slotsRemaining ?? 1}
                    value={quantities[cow.id] ?? 1}
                    onChange={(e) => setQty(cow.id, Number(e.target.value))}
                  />
                </label>
              </div>
            </div>
          </article>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-rose-200">Ram &amp; goat — half or quarter</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {portions.map((p) => (
            <article
              key={p.id}
              className="rounded-2xl border border-rose-400/25 bg-gradient-to-b from-zinc-900 to-zinc-950 p-5 shadow-md"
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-rose-400 text-rose-500"
                  checked={selected[p.id] ?? false}
                  onChange={(e) => setSelected((s) => ({ ...s, [p.id]: e.target.checked }))}
                />
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase text-rose-300">
                    {p.animal} · {p.kind === "HALF" ? "Half" : "Quarter"}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-white">{p.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{p.description}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-lg font-bold text-amber-200">{formatNaira(p.priceNgnKobo)}</span>
                    <span className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                      In stock: {p.stockRemaining}
                    </span>
                  </div>
                  <label className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
                    Qty
                    <input
                      className="w-20 rounded border border-zinc-700 bg-zinc-950 px-2 py-1"
                      type="number"
                      min={1}
                      max={p.stockRemaining}
                      value={quantities[p.id] ?? 1}
                      onChange={(e) => setQty(p.id, Number(e.target.value))}
                    />
                  </label>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <h2 className="text-lg font-semibold text-white">Checkout meat sharing</h2>
        <p className="mt-1 text-sm text-zinc-400">Log in first. We&apos;ll open Paystack when configured.</p>
        <div className="mt-4 space-y-3">
          <input
            className="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
            placeholder="Delivery address"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />
          <input
            className="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
            placeholder="Preferred delivery slot"
            value={deliverySlot}
            onChange={(e) => setDeliverySlot(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="mt-4 w-full rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 px-4 py-3 font-semibold text-zinc-950 hover:from-amber-400 hover:to-rose-400"
          onClick={async () => {
            setMessage("");
            const lines = rows
              .filter((o) => selected[o.id])
              .map((o) => ({
                meatShareOfferingId: o.id,
                quantity: Math.max(1, quantities[o.id] ?? 1),
              }))
              .filter((line) => !line.meatShareOfferingId.startsWith("seed-ms"));
            if (lines.length === 0) {
              setMessage(
                "Select at least one option with a real offering ID, or run `npm run db:seed` and refresh.",
              );
              return;
            }
            const resp = await fetch("/api/checkout/paystack", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                items: [],
                meatShareItems: lines,
                deliveryAddress,
                deliverySlot,
              }),
            });
            const payload = await resp.json();
            if (payload.authorizationUrl) {
              window.location.href = payload.authorizationUrl as string;
              return;
            }
            setMessage(payload.message ?? "Could not start checkout. Ensure you are logged in.");
          }}
        >
          Pay for selected sharing options
        </button>
        {message ? <p className="mt-3 text-sm text-amber-300">{message}</p> : null}
      </section>
    </main>
  );
}
