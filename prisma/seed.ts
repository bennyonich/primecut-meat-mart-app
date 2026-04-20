import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

import { starterProducts } from "../src/lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  for (const product of starterProducts) {
    const category = await prisma.category.upsert({
      where: { name: product.category },
      update: {},
      create: { name: product.category },
    });

    await prisma.product.upsert({
      where: { name: product.name },
      update: {
        description: product.description,
        priceNgnKobo: product.priceNgnKobo,
        inventoryInStock: product.inventoryInStock,
      },
      create: {
        name: product.name,
        description: product.description,
        priceNgnKobo: product.priceNgnKobo,
        inventoryInStock: product.inventoryInStock,
        categoryId: category.id,
      },
    });
  }

  const passwordHash = await hash("Primecut@123", 10);
  await prisma.user.upsert({
    where: { email: "admin@primecut.ng" },
    update: {},
    create: {
      name: "Primecut Admin",
      email: "admin@primecut.ng",
      passwordHash,
      role: "ADMIN",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
