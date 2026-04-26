import { createHmac, timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { fulfillPaidOrder } from "@/lib/fulfill-order";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Paystack: verify `x-paystack-signature` = HMAC SHA512 of raw body with secret key.
 * Dashboard → Settings → API Keys → use same secret as PAYSTACK_SECRET_KEY.
 * Webhook URL: /api/webhooks/paystack
 */
export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "PAYSTACK_SECRET_KEY not set" }, { status: 500 });
  }

  const raw = await request.text();
  const sig = request.headers.get("x-paystack-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const expected = createHmac("sha512", secret).update(raw).digest("hex");
  const validSig =
    expected.length === sig.length && expected.length > 0
      ? (() => {
          try {
            return timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(sig, "utf8"));
          } catch {
            return false;
          }
        })()
      : (() => {
          try {
            const a = Buffer.from(expected, "hex");
            const b = Buffer.from(sig, "hex");
            if (a.length !== b.length) return false;
            return timingSafeEqual(a, b);
          } catch {
            return false;
          }
        })();
  if (!validSig) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: { event?: string; data?: { reference?: string; status?: string; amount?: number } };
  try {
    event = JSON.parse(raw) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event !== "charge.success" || event.data?.status !== "success") {
    return NextResponse.json({ received: true });
  }

  const ref = event.data?.reference;
  if (!ref) {
    return NextResponse.json({ received: true });
  }

  const order = await db.order.findUnique({ where: { paystackReference: ref } });
  if (!order) {
    return NextResponse.json({ received: true });
  }

  if (event.data?.amount != null && event.data.amount !== order.totalAmountNgnKobo) {
    // Amount mismatch: do not fulfill; return 200 so Paystack does not thrash, ops can reconcile.
    return NextResponse.json({ received: true, warn: "amount_mismatch" });
  }

  const result = await fulfillPaidOrder(order.id);
  return NextResponse.json({ received: true, result });
}
