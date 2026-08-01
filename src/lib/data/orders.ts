import { db } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import { orders, productVariants, products } from "@/lib/db/schema";

export async function getOrderByReference(reference: string) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.paystackReference, reference),
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

export async function listOrders() {
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: string) {
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
