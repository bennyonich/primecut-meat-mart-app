import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/require-admin";

const patch = z.object({
  priceNgnKobo: z.number().int().min(0).optional(),
  inventoryInStock: z.number().int().min(0).optional(),
  imageUrl: z.string().max(2000).nullable().optional(),
});

const normalizeImageUrl = (v: string | null | undefined): string | null | "invalid" => {
  if (v == null) return null;
  const t = v.trim();
  if (t === "") return null;
  try {
    return new URL(t).toString();
  } catch {
    return "invalid";
  }
};

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = await request.json();
  const parsed = patch.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const p = parsed.data;
  const data: {
    priceNgnKobo?: number;
    inventoryInStock?: number;
    imageUrl?: string | null;
  } = {};
  if (p.priceNgnKobo !== undefined) {
    data.priceNgnKobo = p.priceNgnKobo;
  }
  if (p.inventoryInStock !== undefined) {
    data.inventoryInStock = p.inventoryInStock;
  }
  if (p.imageUrl !== undefined) {
    const img = normalizeImageUrl(p.imageUrl);
    if (img === "invalid") {
      return NextResponse.json({ error: "Invalid imageUrl" }, { status: 400 });
    }
    data.imageUrl = img;
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  await db.product.update({
    where: { id },
    data,
  });

  return NextResponse.json({ ok: true });
}
