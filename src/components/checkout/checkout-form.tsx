"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createOrder, type CreateOrderState } from "@/app/actions/orders";

const initialState: CreateOrderState = { status: "idle" };

const inputClass =
  "w-full rounded-lg border border-melony-gold/25 bg-melony-black px-4 py-3 text-melony-cream placeholder:text-melony-cream/30 focus:border-melony-gold focus:outline-none";

export function CheckoutForm({
  variantId,
  qty,
}: {
  variantId: string;
  qty: number;
}) {
  const [state, formAction, isPending] = useActionState(
    createOrder,
    initialState,
  );
  const router = useRouter();
  const launchedRef = useRef<string | null>(null);

  useEffect(() => {
    if (state.status !== "success") return;
    if (launchedRef.current === state.reference) return;
    launchedRef.current = state.reference;

    let cancelled = false;

    (async () => {
      const { default: PaystackPop } = await import("@paystack/inline-js");
      if (cancelled) return;

      const popup = new PaystackPop();
      popup.newTransaction({
        key: state.publicKey,
        email: state.email,
        amount: state.amountKobo,
        ref: state.reference,
        currency: "NGN",
        onSuccess: () => {
          router.push(`/order/${state.reference}`);
        },
        onCancel: () => {
          router.push(`/order/${state.reference}`);
        },
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [state, router]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="variantId" value={variantId} />
      <input type="hidden" name="qty" value={qty} />

      <input
        name="customerName"
        placeholder="Full name"
        required
        className={inputClass}
      />
      <input
        name="email"
        type="email"
        placeholder="Email address"
        required
        className={inputClass}
      />
      <input
        name="phone"
        type="tel"
        placeholder="Phone number (e.g. 08012345678)"
        required
        className={inputClass}
      />
      <input
        name="deliveryAddress"
        placeholder="Delivery address"
        required
        className={inputClass}
      />
      <div className="flex gap-4">
        <input
          name="deliveryCity"
          placeholder="City"
          required
          className={inputClass}
        />
        <input
          name="deliveryState"
          placeholder="State"
          required
          className={inputClass}
        />
      </div>
      <textarea
        name="notes"
        placeholder="Notes (optional)"
        rows={3}
        className={inputClass}
      />

      {state.status === "error" && (
        <p className="text-sm text-red-400">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-full bg-melony-gold px-8 py-4 text-lg font-medium text-melony-black transition-colors hover:bg-melony-gold-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Preparing payment…" : "Continue to payment"}
      </button>
    </form>
  );
}
