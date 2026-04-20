import { getServerSession } from "next-auth";
import Link from "next/link";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatNaira } from "@/lib/format";

export default async function SubscriptionsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return (
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        <p>
          Please <Link href="/login" className="underline">login</Link> to manage subscriptions.
        </p>
      </main>
    );
  }

  const subscriptions = await db.subscription
    .findMany({
      where: { userId: session.user.id, isActive: true },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold">Recurring Meat Boxes</h1>
      <p className="mt-2 text-zinc-400">Use `POST /api/subscriptions` to create a new plan.</p>
      <div className="mt-6 space-y-4">
        {subscriptions.length === 0 ? <p className="text-zinc-400">No active subscriptions.</p> : null}
        {subscriptions.map((sub) => (
          <article key={sub.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="font-semibold">{sub.title}</h3>
            <p className="text-sm text-zinc-400">{sub.cadence}</p>
            <p className="mt-2">{formatNaira(sub.amountNgnKobo)}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
