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

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Not authenticated");
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
  const imagesRaw = String(formData.get("images") ?? "");
  const images = imagesRaw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

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
      images,
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId));

  const variantIds = formData.getAll("variantId") as string[];
  for (const variantId of variantIds) {
    const label = String(formData.get(`variantLabel-${variantId}`) ?? "").trim();
    const stockQty = Number(formData.get(`variantStock-${variantId}`));
    if (!label || !Number.isFinite(stockQty)) continue;
    await db
      .update(productVariants)
      .set({ label, stockQty: Math.max(0, Math.round(stockQty)) })
      .where(eq(productVariants.id, variantId));
  }

  revalidatePath("/");
  revalidatePath("/admin/product");
  revalidatePath("/product/[slug]", "page");

  return { status: "success", message: "Product updated." };
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
