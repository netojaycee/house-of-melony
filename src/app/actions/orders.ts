"use server";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { orders, productVariants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { checkoutSchema } from "@/lib/validation/checkout";
import { generateOrderNumber, generatePaystackReference } from "@/lib/order-number";
import { checkRateLimit } from "@/lib/rate-limit";

export type CreateOrderState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | {
      status: "success";
      reference: string;
      amountKobo: number;
      email: string;
      publicKey: string;
    };

export async function createOrder(
  _prevState: CreateOrderState,
  formData: FormData,
): Promise<CreateOrderState> {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const { success } = await checkRateLimit(`checkout:${ip}`);
  if (!success) {
    return {
      status: "error",
      message: "Too many attempts. Please wait a moment and try again.",
    };
  }

  const parsed = checkoutSchema.safeParse({
    variantId: formData.get("variantId"),
    qty: formData.get("qty"),
    customerName: formData.get("customerName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    deliveryAddress: formData.get("deliveryAddress"),
    deliveryCity: formData.get("deliveryCity"),
    deliveryState: formData.get("deliveryState"),
    notes: formData.get("notes") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check your details.",
    };
  }

  const input = parsed.data;

  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, input.variantId),
  });
  if (!variant) {
    return { status: "error", message: "That size is no longer available." };
  }
  if (variant.stockQty < input.qty) {
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
  const amountKobo = product.priceKobo * input.qty;
  const reference = generatePaystackReference();
  const orderNumber = generateOrderNumber();

  await db.insert(orders).values({
    orderNumber,
    variantId: variant.id,
    qty: input.qty,
    amountKobo,
    currency: product.currency,
    status: "pending",
    customerName: input.customerName,
    email: input.email,
    phone: input.phone,
    deliveryAddress: input.deliveryAddress,
    deliveryCity: input.deliveryCity,
    deliveryState: input.deliveryState,
    notes: input.notes || null,
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
    email: input.email,
    publicKey,
  };
}
