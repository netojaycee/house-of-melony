import { db } from "@/lib/db";
import { asc, eq } from "drizzle-orm";
import { products, productVariants } from "@/lib/db/schema";

export async function getActiveProduct() {
  const product = await db.query.products.findFirst({
    where: eq(products.active, true),
  });
  if (!product) return null;

  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, product.id))
    .orderBy(asc(productVariants.sortOrder));

  return { ...product, variants };
}

export type ActiveProduct = NonNullable<
  Awaited<ReturnType<typeof getActiveProduct>>
>;

export function formatNaira(kobo: number): string {
  return `₦${(kobo / 100).toLocaleString("en-NG")}`;
}
