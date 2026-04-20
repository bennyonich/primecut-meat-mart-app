import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { meatShareSeedOfferings } from "@/lib/meat-share-seed";

export async function GET() {
  const rows = await db.meatShareOffering
    .findMany({
      where: { isActive: true },
      orderBy: [{ animal: "asc" }, { kind: "asc" }],
    })
    .catch(() => []);

  if (rows.length > 0) {
    return NextResponse.json({ offerings: rows });
  }

  return NextResponse.json({
    offerings: meatShareSeedOfferings.map((row, i) => ({
      id: `seed-ms-${i}`,
      ...row,
      imageUrl: null,
      isActive: true,
    })),
    seeded: false,
  });
}
