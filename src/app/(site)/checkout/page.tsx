import Image from "next/image";
import { notFound } from "next/navigation";
import { getVariantWithProduct, formatNaira } from "@/lib/data/product";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ variant?: string; qty?: string }>;
}) {
  const { variant: variantId, qty: qtyParam } = await searchParams;
  const qty = Math.min(Math.max(Number(qtyParam) || 1, 1), 10);

  if (!variantId) notFound();

  const result = await getVariantWithProduct(variantId);
  if (!result) notFound();
  const { variant, product } = result;

  if (variant.stockQty < qty) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center text-melony-cream">
        <p>
          Sorry, only {variant.stockQty} left in {variant.label}. Please go
          back and adjust the quantity.
        </p>
      </main>
    );
  }

  const amountKobo = product.priceKobo * qty;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-6 py-16 sm:flex-row sm:py-24">
      <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-melony-gold/15 bg-melony-black-soft p-6 sm:max-w-xs">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-melony-gold/20">
          <Image
            src={product.images[0] ?? "/brand/logo.jpeg"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-display text-lg text-melony-cream">
            {product.name}
          </p>
          <p className="text-sm text-melony-cream/60">
            {variant.label} × {qty}
          </p>
        </div>
        <div className="mt-auto border-t border-melony-gold/15 pt-4">
          <p className="text-sm text-melony-cream/60">Total</p>
          <p className="font-display text-2xl text-melony-gold">
            {formatNaira(amountKobo)}
          </p>
        </div>
      </div>

      <div className="flex-1">
        <h1 className="font-display mb-6 text-2xl text-melony-cream">
          Delivery details
        </h1>
        <CheckoutForm variantId={variant.id} qty={qty} />
      </div>
    </main>
  );
}
