import { getServerSession } from "next-auth";
import Link from "next/link";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatNaira } from "@/lib/format";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return (
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        <p>Please <Link href="/login" className="underline">login</Link> to view your orders.</p>
      </main>
    );
  }

  const orders = await db.order
    .findMany({
      where: { userId: session.user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold">Order Tracking</h1>
      <div className="mt-6 space-y-4">
        {orders.length === 0 ? <p className="text-zinc-400">No orders yet.</p> : null}
        {orders.map((order) => (
          <article key={order.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-400">Ref: {order.paystackReference ?? "pending"}</p>
              <p className="rounded bg-zinc-800 px-2 py-1 text-xs">{order.status}</p>
            </div>
            <p className="mt-2 font-semibold">{formatNaira(order.totalAmountNgnKobo)}</p>
            <p className="text-sm text-zinc-400">
              Delivery: {order.deliverySlot} - {order.deliveryAddress}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
