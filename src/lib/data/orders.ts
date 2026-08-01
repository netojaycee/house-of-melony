import { db } from "@/lib/db";
import { and, desc, eq, sql } from "drizzle-orm";
import { orders, productVariants, products } from "@/lib/db/schema";
import { isUuid } from "@/lib/utils";

export async function getOrderByOrderNumber(orderNumber: string) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.orderNumber, orderNumber),
  });
  if (!order) return null;

  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, order.variantId),
  });
  const product = variant
    ? await db.query.products.findFirst({
        where: eq(products.id, variant.productId),
      })
    : null;

  return { order, variant, product };
}

/**
 * Requires both the order number and the email used at checkout to match
 * (case-insensitive) — order numbers alone aren't secret enough to be a
 * lookup key on their own for a page showing a delivery address.
 */
export async function findOrderForTracking(orderNumber: string, email: string) {
  const order = await db.query.orders.findFirst({
    where: and(
      eq(sql`upper(${orders.orderNumber})`, orderNumber.trim().toUpperCase()),
      eq(sql`lower(${orders.email})`, email.trim().toLowerCase()),
    ),
  });
  return order ?? null;
}

export async function listOrders() {
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: string) {
  if (!isUuid(id)) return null;

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
  });
  if (!order) return null;

  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, order.variantId),
  });
  const product = variant
    ? await db.query.products.findFirst({
        where: eq(products.id, variant.productId),
      })
    : null;

  return { order, variant, product };
}
