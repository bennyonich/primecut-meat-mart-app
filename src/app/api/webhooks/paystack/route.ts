import { createHmac, timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { fulfillPaidOrder } from "@/lib/fulfill-order";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Paystack: `x-paystack-signature` equals the hex string from
 * `createHmac('sha512', secret).update(rawBody).digest('hex')`.
 * Use the same `PAYSTACK_SECRET_KEY` as the Transaction Initialize API.
 * Dashboard → Settings → API Keys.
 * Webhook URL: `https://<your-host>/api/webhooks/paystack`
 */
export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "PAYSTACK_SECRET_KEY not set" }, { status: 500 });
  }

  const raw = await request.text();
  const sig = request.headers.get("x-paystack-signature")?.trim() ?? "";
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const expected = createHmac("sha512", secret).update(raw, "utf8").digest("hex");
  if (expected.length !== sig.length) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(sig, "utf8");
  if (!timingSafeEqual(a, b)) {
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

  const payAmount = event.data?.amount;
  if (payAmount != null && Number(payAmount) !== order.totalAmountNgnKobo) {
    return NextResponse.json({ received: true, warn: "amount_mismatch" });
  }

  const result = await fulfillPaidOrder(order.id);
  return NextResponse.json({ received: true, result });
}
