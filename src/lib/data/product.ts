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

export async function getProductBySlug(slug: string) {
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });
  if (!product || !product.active) return null;

  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, product.id))
    .orderBy(asc(productVariants.sortOrder));

  return { ...product, variants };
}

export async function getVariantWithProduct(variantId: string) {
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, variantId),
  });
  if (!variant) return null;

  const product = await db.query.products.findFirst({
    where: eq(products.id, variant.productId),
  });
  if (!product) return null;

  return { variant, product };
}

export async function getFirstProduct() {
  const product = await db.query.products.findFirst();
  if (!product) return null;

  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, product.id))
    .orderBy(asc(productVariants.sortOrder));

  return { ...product, variants };
}

export function formatNaira(kobo: number): string {
  return `₦${(kobo / 100).toLocaleString("en-NG")}`;
}
