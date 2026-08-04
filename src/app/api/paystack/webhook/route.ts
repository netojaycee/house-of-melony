import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { verifyWebhookSignature, verifyTransaction } from "@/lib/paystack";
import { applyOrderPaidSideEffects } from "@/lib/order-paid";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as { event: string; data: { reference: string } };

  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true });
  }

  const reference = event.data.reference;

  // Signature confirms Paystack sent this, but we still ask Paystack
  // directly whether the charge actually succeeded before trusting it.
  const verification = await verifyTransaction(reference);
  if (verification.data.status !== "success") {
    return NextResponse.json({ received: true });
  }

  // Idempotent: only the first webhook delivery for a reference flips
  // pending -> paid; retries/duplicates find no row and no-op.
  const [updatedOrder] = await db
    .update(orders)
    .set({ status: "paid", updatedAt: new Date() })
    .where(and(eq(orders.paystackReference, reference), eq(orders.status, "pending")))
    .returning();

  if (!updatedOrder) {
    return NextResponse.json({ received: true });
  }

  await applyOrderPaidSideEffects(updatedOrder);

  return NextResponse.json({ received: true });
}
