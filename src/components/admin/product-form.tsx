"use client";

import { useActionState } from "react";
import { updateProduct, type UpdateProductState } from "@/app/actions/admin";

const initialState: UpdateProductState = { status: "idle" };

const inputClass =
  "w-full rounded-lg border border-melony-gold/25 bg-melony-black px-4 py-3 text-melony-cream placeholder:text-melony-cream/30 focus:border-melony-gold focus:outline-none";

export function ProductForm({
  productId,
  name,
  tagline,
  story,
  priceNaira,
  active,
}: {
  productId: string;
  name: string;
  tagline: string | null;
  story: string;
  priceNaira: number;
  active: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    updateProduct,
    initialState,
  );

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      <input type="hidden" name="productId" value={productId} />

      <label className="flex flex-col gap-1 text-sm text-melony-cream/60">
        Name
        <input name="name" defaultValue={name} required className={inputClass} />
      </label>

      <label className="flex flex-col gap-1 text-sm text-melony-cream/60">
        Tagline
        <input
          name="tagline"
          defaultValue={tagline ?? ""}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-melony-cream/60">
        Story
        <textarea
          name="story"
          defaultValue={story}
          required
          rows={8}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-melony-cream/60">
        Price (₦)
        <input
          name="priceNaira"
          type="number"
          min="0"
          step="1"
          defaultValue={priceNaira}
          required
          className={inputClass}
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-melony-cream/80">
        <input type="checkbox" name="active" defaultChecked={active} />
        Listed / active
      </label>

      {state.status !== "idle" && (
        <p
          className={
            state.status === "success" ? "text-melony-gold" : "text-red-400"
          }
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 self-start rounded-full bg-melony-gold px-6 py-3 font-medium text-melony-black hover:bg-melony-gold-light disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
