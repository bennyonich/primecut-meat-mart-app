import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { db } from "@/lib/db";

export default async function AdminPage() {
  const [products, meatShare] = await Promise.all([
    db.product.findMany({ orderBy: { name: "asc" } }),
    db.meatShareOffering.findMany({ orderBy: [{ animal: "asc" }, { kind: "asc" }] }),
  ]);

  return (
    <AdminDashboard
      meatShare={meatShare.map((m) => ({
        id: m.id,
        title: m.title,
        priceNgnKobo: m.priceNgnKobo,
        slotsRemaining: m.slotsRemaining,
        stockRemaining: m.stockRemaining,
        imageUrl: m.imageUrl,
      }))}
      products={products.map((p) => ({
        id: p.id,
        name: p.name,
        priceNgnKobo: p.priceNgnKobo,
        inventoryInStock: p.inventoryInStock,
        imageUrl: p.imageUrl,
      }))}
    />
  );
}
