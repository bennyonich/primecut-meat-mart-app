import { randomUUID } from "crypto";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    }),
  ),
  deliveryAddress: z.string().min(10),
  deliverySlot: z.string().min(3),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
  }

  const products = await db.product.findMany({
    where: { id: { in: parsed.data.items.map((item) => item.productId) }, isActive: true },
  });

  const priceMap = new Map(products.map((p) => [p.id, p.priceNgnKobo]));
  const total = parsed.data.items.reduce((acc, item) => {
    const unitPrice = priceMap.get(item.productId) ?? 0;
    return acc + unitPrice * item.quantity;
  }, 0);

  const reference = `primecut_${randomUUID()}`;
  const order = await db.order.create({
    data: {
      userId: session.user.id,
      totalAmountNgnKobo: total,
      deliveryAddress: parsed.data.deliveryAddress,
      deliverySlot: parsed.data.deliverySlot,
      paystackReference: reference,
      items: {
        create: parsed.data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPriceNgnKobo: priceMap.get(item.productId) ?? 0,
        })),
      },
    },
  });

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      {
        orderId: order.id,
        reference,
        message: "Set PAYSTACK_SECRET_KEY to enable live initialization.",
      },
      { status: 202 },
    );
  }

  const paymentResp = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: session.user.email,
      amount: total,
      reference,
      currency: "NGN",
      metadata: {
        orderId: order.id,
      },
    }),
  });

  const payload = await paymentResp.json();
  if (!paymentResp.ok) {
    return NextResponse.json({ error: payload?.message ?? "Payment init failed" }, { status: 502 });
  }

  return NextResponse.json({
    orderId: order.id,
    reference,
    authorizationUrl: payload?.data?.authorization_url as string | undefined,
  });
}
