"use client";

import { useEffect, useMemo, useState } from "react";

import { formatNaira } from "@/lib/format";

type Product = {
  id: string;
  name: string;
  priceNgnKobo: number;
};

export default function CheckoutPage() {
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliverySlot, setDeliverySlot] = useState("Tomorrow 9AM-12PM");
  const [checkoutMessage, setCheckoutMessage] = useState("");

  useEffect(() => {
    fetch("/api/catalog")
      .then((resp) => resp.json())
      .then((data) => {
        const products = (data.products as Product[]) ?? [];
        setCatalog(products);
        setProductId(products[0]?.id ?? "");
      })
      .catch(() => undefined);
  }, []);

  const selectedProduct = useMemo(
    () => catalog.find((item) => item.id === productId),
    [catalog, productId],
  );

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold">Cart + Checkout</h1>
      <p className="mt-2 text-zinc-400">
        Buy per-kilogram cuts (cow, goat, ram, chicken, turkey). This initializes Paystack with
        NGN pricing.
      </p>
      <form
        className="mt-6 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const resp = await fetch("/api/checkout/paystack", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: [{ productId, quantity }],
              meatShareItems: [],
              deliveryAddress,
              deliverySlot,
            }),
          });
          const payload = await resp.json();
          if (payload.authorizationUrl) {
            window.location.href = payload.authorizationUrl as string;
            return;
          }
          setCheckoutMessage(payload.message ?? "Checkout initialized.");
        }}
      >
        <select
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >
          {catalog.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <input
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <p className="text-xs text-zinc-500">Quantity here is in kilograms.</p>
        <input
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
          placeholder="Delivery address"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          required
        />
        <input
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
          placeholder="Preferred delivery slot"
          value={deliverySlot}
          onChange={(e) => setDeliverySlot(e.target.value)}
          required
        />
        <p className="text-sm text-zinc-400">
          Total: {selectedProduct ? formatNaira(selectedProduct.priceNgnKobo * quantity) : "NGN 0.00"}
        </p>
        <button className="w-full rounded bg-emerald-600 px-3 py-2 font-medium hover:bg-emerald-500">
          Checkout with Paystack
        </button>
      </form>
      {checkoutMessage ? <p className="mt-4 text-sm text-amber-300">{checkoutMessage}</p> : null}
    </main>
  );
}
