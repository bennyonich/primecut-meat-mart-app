export type MeatShareSeedRow = {
  title: string;
  description: string;
  animal: "COW" | "RAM" | "GOAT";
  kind: "COW_SLOT" | "HALF" | "QUARTER";
  totalSlots: number | null;
  slotsRemaining: number | null;
  stockRemaining: number;
  priceNgnKobo: number;
};

/** Default group-buy listings: cow in 10 slots; ram & goat in half or quarter. */
export const meatShareSeedOfferings: MeatShareSeedRow[] = [
  {
    title: "Full cow — shared slots",
    description:
      "Pool with neighbours: one full cow split into 10 equal slots. Pay per slot; butchered and packed per slot.",
    animal: "COW",
    kind: "COW_SLOT",
    totalSlots: 10,
    slotsRemaining: 10,
    stockRemaining: 0,
    priceNgnKobo: 4_500_000, // ₦45,000 per slot (example)
  },
  {
    title: "Ram — half",
    description: "Half ram, trimmed and portioned for your household.",
    animal: "RAM",
    kind: "HALF",
    totalSlots: null,
    slotsRemaining: null,
    stockRemaining: 8,
    priceNgnKobo: 95_000_000, // ₦950,000 example
  },
  {
    title: "Ram — quarter",
    description: "Quarter ram, ideal for smaller families.",
    animal: "RAM",
    kind: "QUARTER",
    totalSlots: null,
    slotsRemaining: null,
    stockRemaining: 12,
    priceNgnKobo: 52_000_000,
  },
  {
    title: "Goat — half",
    description: "Half goat, fresh cut for stews and grills.",
    animal: "GOAT",
    kind: "HALF",
    totalSlots: null,
    slotsRemaining: null,
    stockRemaining: 10,
    priceNgnKobo: 48_000_000,
  },
  {
    title: "Goat — quarter",
    description: "Quarter goat portion.",
    animal: "GOAT",
    kind: "QUARTER",
    totalSlots: null,
    slotsRemaining: null,
    stockRemaining: 14,
    priceNgnKobo: 26_000_000,
  },
];
