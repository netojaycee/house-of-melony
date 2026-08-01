"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { formatNaira } from "@/lib/data/product";
import { siteButtonClass } from "@/lib/site-button";

type Variant = {
  id: string;
  label: string;
  stockQty: number;
};

export function VariantSelector({
  variants,
  priceKobo,
}: {
  variants: Variant[];
  priceKobo: number;
}) {
  const router = useRouter();
  const firstInStock = variants.find((v) => v.stockQty > 0) ?? variants[0];
  const [variantId, setVariantId] = useState(firstInStock?.id ?? "");
  const [qty, setQty] = useState(1);

  const selected = useMemo(
    () => variants.find((v) => v.id === variantId),
    [variants, variantId],
  );
  const maxQty = Math.min(selected?.stockQty ?? 0, 10);
  const soldOut = !selected || selected.stockQty === 0;

  function handleBuyNow() {
    if (!selected || soldOut) return;
    const params = new URLSearchParams({
      variant: selected.id,
      qty: String(qty),
    });
    router.push(`/checkout?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-3 text-sm tracking-[0.2em] text-melony-gold uppercase">
          Size
        </p>
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => {
            const isSelected = variant.id === variantId;
            const isSoldOut = variant.stockQty === 0;
            return (
              <button
                key={variant.id}
                type="button"
                disabled={isSoldOut}
                onClick={() => {
                  setVariantId(variant.id);
                  setQty(1);
                }}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  isSoldOut
                    ? "cursor-not-allowed border-melony-gold/10 text-melony-cream/30 line-through"
                    : isSelected
                      ? "border-melony-gold bg-melony-gold text-melony-black"
                      : "border-melony-gold/40 text-melony-cream hover:border-melony-gold"
                }`}
              >
                {variant.label}
                {isSoldOut ? " — Sold out" : ""}
              </button>
            );
          })}
        </div>
      </div>

      {!soldOut && (
        <div>
          <p className="mb-3 text-sm tracking-[0.2em] text-melony-gold uppercase">
            Quantity
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="h-9 w-9 rounded-full border border-melony-gold/40 text-melony-cream hover:border-melony-gold"
            >
              −
            </button>
            <span className="w-6 text-center text-melony-cream">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
              className="h-9 w-9 rounded-full border border-melony-gold/40 text-melony-cream hover:border-melony-gold"
            >
              +
            </button>
            <span className="text-sm text-melony-cream/50">
              {selected?.stockQty} left
            </span>
          </div>
        </div>
      )}

      <motion.button
        type="button"
        disabled={soldOut}
        onClick={handleBuyNow}
        whileHover={soldOut ? undefined : { scale: 1.03 }}
        whileTap={soldOut ? undefined : { scale: 0.97 }}
        className={
          soldOut
            ? "cursor-not-allowed rounded-full bg-melony-gold/20 px-8 py-4 text-lg font-medium text-melony-cream/40"
            : siteButtonClass("primary", "lg")
        }
      >
        {soldOut ? "Sold out" : `Buy now — ${formatNaira(priceKobo * qty)}`}
      </motion.button>
    </div>
  );
}
