import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { starterProducts } from "@/lib/seed-data";

export async function GET() {
  const products = await db.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  if (products.length > 0) {
    return NextResponse.json({ products });
  }

  return NextResponse.json({
    products: starterProducts.map((item, idx) => ({
      id: `seed-${idx}`,
      ...item,
      category: { name: item.category },
    })),
    seeded: false,
  });
}
