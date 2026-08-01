"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  orders,
  orderStatusValues,
  products,
  productVariants,
  siteSettings,
  type OrderStatus,
} from "@/lib/db/schema";
import { uploadProductImage, deleteProductImage } from "@/lib/r2";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Not authenticated");
}

function revalidateProductPages() {
  revalidatePath("/");
  revalidatePath("/admin/product");
  revalidatePath("/product/[slug]", "page");
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await requireAdmin();
  if (!orderStatusValues.includes(status)) {
    throw new Error("Invalid status");
  }
  await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, orderId));
  revalidatePath("/admin");
  revalidatePath(`/admin/orders/${orderId}`);
}

export type UpdateProductState = { status: "idle" | "success" | "error"; message?: string };

export async function updateProduct(
  _prevState: UpdateProductState,
  formData: FormData,
): Promise<UpdateProductState> {
  await requireAdmin();

  const productId = String(formData.get("productId"));
  const name = String(formData.get("name") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const story = String(formData.get("story") ?? "").trim();
  const priceNaira = Number(formData.get("priceNaira"));
  const active = formData.get("active") === "on";

  if (!name || !story || !Number.isFinite(priceNaira) || priceNaira <= 0) {
    return { status: "error", message: "Please fill in all required fields." };
  }

  await db
    .update(products)
    .set({
      name,
      tagline,
      story,
      priceKobo: Math.round(priceNaira * 100),
      active,
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId));

  revalidateProductPages();

  return { status: "success", message: "Product updated." };
}

// --- Images ---------------------------------------------------------------

export type UploadImageResult = { status: "success" } | { status: "error"; message: string };

export async function uploadProductImageAction(
  productId: string,
  formData: FormData,
): Promise<UploadImageResult> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "No file provided." };
  }

  const result = await uploadProductImage(file);
  if ("error" in result) {
    return { status: "error", message: result.error };
  }

  const product = await db.query.products.findFirst({ where: eq(products.id, productId) });
  if (!product) return { status: "error", message: "Product not found." };

  await db
    .update(products)
    .set({ images: [...product.images, result.url], updatedAt: new Date() })
    .where(eq(products.id, productId));

  revalidateProductPages();

  return { status: "success" };
}

export async function removeProductImageAction(productId: string, url: string) {
  await requireAdmin();

  const product = await db.query.products.findFirst({ where: eq(products.id, productId) });
  if (!product) return;

  await db
    .update(products)
    .set({ images: product.images.filter((img) => img !== url), updatedAt: new Date() })
    .where(eq(products.id, productId));

  await deleteProductImage(url);
  revalidateProductPages();
}

// --- Variants ---------------------------------------------------------------

function generateSku(): string {
  return `VAR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function addVariantAction(
  productId: string,
  label: string,
  stockQty: number,
) {
  await requireAdmin();
  if (!label.trim()) throw new Error("Label is required");

  const existing = await db
    .select({ sortOrder: productVariants.sortOrder })
    .from(productVariants)
    .where(eq(productVariants.productId, productId));
  const nextSort = existing.reduce((max, v) => Math.max(max, v.sortOrder), 0) + 1;

  await db.insert(productVariants).values({
    productId,
    label: label.trim(),
    sku: generateSku(),
    stockQty: Math.max(0, Math.round(stockQty)),
    sortOrder: nextSort,
    active: true,
  });

  revalidateProductPages();
}

export async function updateVariantAction(
  variantId: string,
  label: string,
  stockQty: number,
) {
  await requireAdmin();
  if (!label.trim()) throw new Error("Label is required");

  await db
    .update(productVariants)
    .set({ label: label.trim(), stockQty: Math.max(0, Math.round(stockQty)) })
    .where(eq(productVariants.id, variantId));

  revalidateProductPages();
}

export async function setVariantActiveAction(variantId: string, active: boolean) {
  await requireAdmin();
  await db
    .update(productVariants)
    .set({ active })
    .where(eq(productVariants.id, variantId));
  revalidateProductPages();
}

export type UpdateSettingsState = { status: "idle" | "success" | "error"; message?: string };

export async function updateSiteSettings(
  _prevState: UpdateSettingsState,
  formData: FormData,
): Promise<UpdateSettingsState> {
  await requireAdmin();

  const heroHeadline = String(formData.get("heroHeadline") ?? "").trim();
  const heroSubcopy = String(formData.get("heroSubcopy") ?? "").trim();
  const announcement = String(formData.get("announcement") ?? "").trim();

  await db
    .insert(siteSettings)
    .values({
      id: 1,
      heroHeadline,
      heroSubcopy,
      announcement: announcement || null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: {
        heroHeadline,
        heroSubcopy,
        announcement: announcement || null,
        updatedAt: new Date(),
      },
    });

  revalidatePath("/");
  revalidatePath("/admin/settings");

  return { status: "success", message: "Settings saved." };
}
