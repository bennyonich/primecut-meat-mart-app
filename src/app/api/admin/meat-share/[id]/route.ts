import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/require-admin";

const patch = z.object({
  priceNgnKobo: z.number().int().min(0).optional(),
  slotsRemaining: z.number().int().min(0).nullable().optional(),
  stockRemaining: z.number().int().min(0).optional(),
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

  const data: {
    priceNgnKobo?: number;
    slotsRemaining?: number | null;
    stockRemaining?: number;
    imageUrl?: string | null;
  } = { ...parsed.data };
  if (data.imageUrl !== undefined) {
    const img = normalizeImageUrl(data.imageUrl);
    if (img === "invalid") {
      return NextResponse.json({ error: "Invalid imageUrl" }, { status: 400 });
    }
    data.imageUrl = img;
  }

  await db.meatShareOffering.update({
    where: { id },
    data,
  });

  return NextResponse.json({ ok: true });
}
