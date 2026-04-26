import { randomUUID } from "crypto";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const lineItem = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

const meatLine = z.object({
  meatShareOfferingId: z.string(),
  quantity: z.number().int().positive(),
});

const checkoutSchema = z
  .object({
    items: z.array(lineItem).default([]),
    meatShareItems: z.array(meatLine).default([]),
    deliveryAddress: z.string().min(10),
    deliverySlot: z.string().min(3),
  })
  .refine((data) => data.items.length > 0 || data.meatShareItems.length > 0, {
    message: "Add at least one catalog item or meat-sharing line.",
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

  const { items, meatShareItems, deliveryAddress, deliverySlot } = parsed.data;

  try {
    const result = await db.$transaction(async (tx) => {
      let total = 0;

      const productCreates: {
        productId: string;
        quantity: number;
        unitPriceNgnKobo: number;
      }[] = [];

      if (items.length > 0) {
        const products = await tx.product.findMany({
          where: {
            id: { in: items.map((i) => i.productId) },
            isActive: true,
          },
        });
        const priceMap = new Map(products.map((p) => [p.id, p]));
        const qtyByProduct = new Map<string, number>();
        for (const line of items) {
          qtyByProduct.set(line.productId, (qtyByProduct.get(line.productId) ?? 0) + line.quantity);
        }
        for (const line of items) {
          const p = priceMap.get(line.productId);
          if (!p) {
            throw new Error("PRODUCT_NOT_FOUND");
          }
          const unit = p.priceNgnKobo;
          total += unit * line.quantity;
          productCreates.push({
            productId: line.productId,
            quantity: line.quantity,
            unitPriceNgnKobo: unit,
          });
        }
        for (const p of products) {
          const need = qtyByProduct.get(p.id) ?? 0;
          if (p.inventoryInStock < need) {
            throw new Error("INSUFFICIENT_STOCK");
          }
        }
      }

      const meatCreates: {
        meatShareOfferingId: string;
        quantity: number;
        unitPriceNgnKobo: number;
      }[] = [];

      if (meatShareItems.length > 0) {
        const needByOffer = new Map<string, number>();
        for (const line of meatShareItems) {
          needByOffer.set(
            line.meatShareOfferingId,
            (needByOffer.get(line.meatShareOfferingId) ?? 0) + line.quantity,
          );
        }
        const offerRows = await tx.meatShareOffering.findMany({
          where: { id: { in: [...needByOffer.keys()] }, isActive: true },
        });
        for (const off of offerRows) {
          const need = needByOffer.get(off.id) ?? 0;
          if (off.kind === "COW_SLOT") {
            if (need > (off.slotsRemaining ?? 0)) {
              throw new Error("COW_SLOTS_EXCEEDED");
            }
          } else if (need > off.stockRemaining) {
            throw new Error("PORTION_STOCK_EXCEEDED");
          }
        }
        if (offerRows.length !== needByOffer.size) {
          throw new Error("MEAT_OFFER_NOT_FOUND");
        }
        for (const line of meatShareItems) {
          const offering = offerRows.find((o) => o.id === line.meatShareOfferingId);
          if (!offering) {
            throw new Error("MEAT_OFFER_NOT_FOUND");
          }
          const unit = offering.priceNgnKobo;
          total += unit * line.quantity;
          meatCreates.push({
            meatShareOfferingId: offering.id,
            quantity: line.quantity,
            unitPriceNgnKobo: unit,
          });
        }
      }

      const reference = `primecut_${randomUUID()}`;

      const order = await tx.order.create({
        data: {
          userId: session.user!.id,
          totalAmountNgnKobo: total,
          deliveryAddress,
          deliverySlot,
          paystackReference: reference,
          ...(productCreates.length > 0
            ? {
                items: {
                  create: productCreates.map((p) => ({
                    productId: p.productId,
                    quantity: p.quantity,
                    unitPriceNgnKobo: p.unitPriceNgnKobo,
                  })),
                },
              }
            : {}),
          ...(meatCreates.length > 0
            ? {
                meatShareItems: {
                  create: meatCreates.map((m) => ({
                    meatShareOfferingId: m.meatShareOfferingId,
                    quantity: m.quantity,
                    unitPriceNgnKobo: m.unitPriceNgnKobo,
                  })),
                },
              }
            : {}),
        },
        include: {
          items: true,
          meatShareItems: true,
        },
      });

      return { order, total, reference };
    });

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        {
          orderId: result.order.id,
          reference: result.reference,
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
        amount: result.total,
        reference: result.reference,
        currency: "NGN",
        metadata: {
          orderId: result.order.id,
        },
      }),
    });

    const payload = await paymentResp.json();
    if (!paymentResp.ok) {
      return NextResponse.json({ error: payload?.message ?? "Payment init failed" }, { status: 502 });
    }

    return NextResponse.json({
      orderId: result.order.id,
      reference: result.reference,
      authorizationUrl: payload?.data?.authorization_url as string | undefined,
    });
  } catch (err) {
    const code = err instanceof Error ? err.message : "";
    if (code === "PRODUCT_NOT_FOUND") {
      return NextResponse.json({ error: "One or more products are unavailable." }, { status: 400 });
    }
    if (code === "MEAT_OFFER_NOT_FOUND") {
      return NextResponse.json({ error: "Meat-sharing offer not found." }, { status: 400 });
    }
    if (code === "INSUFFICIENT_STOCK") {
      return NextResponse.json({ error: "Not enough stock for the requested weight." }, { status: 409 });
    }
    if (code === "COW_SLOTS_EXCEEDED") {
      return NextResponse.json({ error: "Not enough cow slots available." }, { status: 409 });
    }
    if (code === "PORTION_STOCK_EXCEEDED") {
      return NextResponse.json({ error: "Not enough stock for that portion." }, { status: 409 });
    }
    throw err;
  }
}
