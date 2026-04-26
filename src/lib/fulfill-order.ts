import { db } from "@/lib/db";

export type FulfillResult = "paid" | "already_done" | "failed";

/**
 * Called after Paystack confirms payment. Idempotent: only processes PENDING orders.
 * If stock is no longer available, the order is marked CANCELLED (handle refund in ops).
 */
export async function fulfillPaidOrder(orderId: string): Promise<FulfillResult> {
  const existing = await db.order.findUnique({ where: { id: orderId } });
  if (!existing) {
    return "failed";
  }
  if (existing.status !== "PENDING") {
    return existing.status === "PAID" ? "already_done" : "failed";
  }

  try {
    await db.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true, meatShareItems: true },
      });
      if (!order || order.status !== "PENDING") {
        return;
      }

      for (const line of order.items) {
        const res = await tx.product.updateMany({
          where: { id: line.productId, inventoryInStock: { gte: line.quantity } },
          data: { inventoryInStock: { decrement: line.quantity } },
        });
        if (res.count === 0) {
          throw new Error("INSUFFICIENT_STOCK");
        }
      }

      for (const line of order.meatShareItems) {
        const off = await tx.meatShareOffering.findUnique({ where: { id: line.meatShareOfferingId } });
        if (!off) {
          throw new Error("MEAT_OFFER_MISSING");
        }
        if (off.kind === "COW_SLOT") {
          const have = off.slotsRemaining ?? 0;
          if (have < line.quantity) {
            throw new Error("COW_SLOTS");
          }
          await tx.meatShareOffering.update({
            where: { id: off.id },
            data: { slotsRemaining: { decrement: line.quantity } },
          });
        } else {
          if (off.stockRemaining < line.quantity) {
            throw new Error("PORTION_STOCK");
          }
          await tx.meatShareOffering.update({
            where: { id: off.id },
            data: { stockRemaining: { decrement: line.quantity } },
          });
        }
      }

      await tx.order.update({
        where: { id: orderId },
        data: { status: "PAID" },
      });
    });
    return "paid";
  } catch {
    const again = await db.order.findUnique({ where: { id: orderId } });
    if (again?.status === "PAID") {
      return "already_done";
    }
    await db.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    });
    return "failed";
  }
}
