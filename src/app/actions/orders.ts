"use server";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { orders, productVariants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { checkoutSchema } from "@/lib/validation/checkout";
import { generateOrderNumber, generatePaystackReference } from "@/lib/order-number";
import { checkRateLimit } from "@/lib/rate-limit";

export type CreateOrderResult =
  | { status: "error"; message: string }
  | {
      status: "success";
      reference: string;
      amountKobo: number;
      email: string;
      publicKey: string;
    };

/**
 * Called directly from the client with already-validated (react-hook-form +
 * zod) input, not bound to a native <form action>. Re-validates server-side
 * regardless — client validation is UX only, never trusted on its own.
 */
export async function createOrder(input: unknown): Promise<CreateOrderResult> {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const { success } = await checkRateLimit(`checkout:${ip}`);
  if (!success) {
    return {
      status: "error",
      message: "Too many attempts. Please wait a moment and try again.",
    };
  }

  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check your details.",
    };
  }

  const parsedInput = parsed.data;

  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, parsedInput.variantId),
  });
  if (!variant || !variant.active) {
    return { status: "error", message: "That size is no longer available." };
  }
  if (variant.stockQty < parsedInput.qty) {
    return {
      status: "error",
      message: `Only ${variant.stockQty} left in this size.`,
    };
  }

  const product = await db.query.products.findFirst({
    where: (p, { eq }) => eq(p.id, variant.productId),
  });
  if (!product || !product.active) {
    return { status: "error", message: "This product is not available." };
  }

  // Price is derived from the DB, never trusted from the client.
  const amountKobo = product.priceKobo * parsedInput.qty;
  const reference = generatePaystackReference();
  const orderNumber = generateOrderNumber();

  await db.insert(orders).values({
    orderNumber,
    variantId: variant.id,
    qty: parsedInput.qty,
    amountKobo,
    currency: product.currency,
    status: "pending",
    customerName: parsedInput.customerName,
    email: parsedInput.email,
    phone: parsedInput.phone,
    deliveryAddress: parsedInput.deliveryAddress,
    deliveryCity: parsedInput.deliveryCity,
    deliveryState: parsedInput.deliveryState,
    notes: parsedInput.notes || null,
    paystackReference: reference,
  });

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  if (!publicKey) {
    return {
      status: "error",
      message: "Payments aren't configured yet. Please try again later.",
    };
  }

  return {
    status: "success",
    reference,
    amountKobo,
    email: parsedInput.email,
    publicKey,
  };
}
