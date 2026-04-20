import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { meatShareSeedOfferings } from "@/lib/meat-share-seed";
import { starterProducts } from "@/lib/seed-data";

export async function POST() {
  const existing = await db.product.count();
  if (existing === 0) {
    const categoryIds = new Map<string, string>();
    for (const product of starterProducts) {
      const category = await db.category.upsert({
        where: { name: product.category },
        update: {},
        create: { name: product.category },
      });
      categoryIds.set(product.category, category.id);
    }

    for (const product of starterProducts) {
      await db.product.create({
        data: {
          name: product.name,
          description: product.description,
          priceNgnKobo: product.priceNgnKobo,
          inventoryInStock: product.inventoryInStock,
          categoryId: categoryIds.get(product.category)!,
        },
      });
    }
  }

  for (const row of meatShareSeedOfferings) {
    await db.meatShareOffering.upsert({
      where: {
        animal_kind: { animal: row.animal, kind: row.kind },
      },
      update: {
        title: row.title,
        description: row.description,
        totalSlots: row.totalSlots,
        slotsRemaining: row.slotsRemaining,
        stockRemaining: row.stockRemaining,
        priceNgnKobo: row.priceNgnKobo,
      },
      create: {
        title: row.title,
        description: row.description,
        animal: row.animal,
        kind: row.kind,
        totalSlots: row.totalSlots,
        slotsRemaining: row.slotsRemaining,
        stockRemaining: row.stockRemaining,
        priceNgnKobo: row.priceNgnKobo,
      },
    });
  }

  const adminPassword = await hash("Primecut@123", 10);
  await db.user.upsert({
    where: { email: "admin@primecut.ng" },
    update: {},
    create: {
      name: "Primecut Admin",
      email: "admin@primecut.ng",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  return NextResponse.json({
    message: existing === 0 ? "Seed complete" : "Meat-sharing + admin sync complete",
    adminLogin: {
      email: "admin@primecut.ng",
      password: "Primecut@123",
    },
  });
}
