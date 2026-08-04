import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, productVariants, products } from "@/lib/db/schema";
import { sendOrderEmails } from "@/lib/email/send-order-emails";

/**
 * Decrements stock and sends the order-confirmation email. Called once an
 * order is confirmed paid — via the Paystack webhook, or an admin manually
 * marking a WhatsApp/offline order as paid.
 */
export async function applyOrderPaidSideEffects(order: typeof orders.$inferSelect) {
  const [variant] = await db
    .update(productVariants)
    .set({ stockQty: sql`greatest(${productVariants.stockQty} - ${order.qty}, 0)` })
    .where(eq(productVariants.id, order.variantId))
    .returning();

  const product = variant
    ? await db.query.products.findFirst({ where: eq(products.id, variant.productId) })
    : null;

  await sendOrderEmails({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    email: order.email,
    phone: order.phone,
    productName: product?.name ?? "Òkè Wúrà Set",
    variantLabel: variant?.label ?? "",
    qty: order.qty,
    amountKobo: order.amountKobo,
    deliveryAddress: order.deliveryAddress,
    deliveryCity: order.deliveryCity,
    deliveryState: order.deliveryState,
    notes: order.notes,
  });
}
