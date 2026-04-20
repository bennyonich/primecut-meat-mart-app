import { addWeeks } from "date-fns";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const subscriptionSchema = z.object({
  title: z.string().min(3),
  cadence: z.string().min(3),
  amountNgnKobo: z.number().int().positive(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscriptions = await db.subscription.findMany({
    where: { userId: session.user.id, isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ subscriptions });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = subscriptionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid subscription payload" }, { status: 400 });
  }

  const subscription = await db.subscription.create({
    data: {
      userId: session.user.id,
      title: parsed.data.title,
      cadence: parsed.data.cadence,
      amountNgnKobo: parsed.data.amountNgnKobo,
      nextDeliveryDate: addWeeks(new Date(), 1),
    },
  });
  return NextResponse.json({ subscription }, { status: 201 });
}
