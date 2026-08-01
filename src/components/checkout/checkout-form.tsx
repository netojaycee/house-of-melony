"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { createOrder } from "@/app/actions/orders";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/lib/validation/checkout";
import { siteButtonClass } from "@/lib/site-button";

const inputClass =
  "w-full rounded-lg border border-melony-gold/25 bg-melony-black px-4 py-3 text-melony-cream placeholder:text-melony-cream/30 focus:border-melony-gold focus:outline-none";
const errorClass = "mt-1 text-sm text-red-400";

export function CheckoutForm({
  variantId,
  qty,
}: {
  variantId: string;
  qty: number;
}) {
  const router = useRouter();
  const launchedRef = useRef<string | null>(null);
  const [rootError, setRootError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { variantId, qty, notes: "" },
  });

  async function onSubmit(data: CheckoutFormValues) {
    setRootError(null);
    const result = await createOrder(data);

    if (result.status === "error") {
      setRootError(result.message);
      return;
    }

    if (launchedRef.current === result.reference) return;
    launchedRef.current = result.reference;

    const { default: PaystackPop } = await import("@paystack/inline-js");
    const popup = new PaystackPop();
    popup.newTransaction({
      key: result.publicKey,
      email: result.email,
      amount: result.amountKobo,
      ref: result.reference,
      currency: "NGN",
      onSuccess: () => {
        router.push(`/order/${result.reference}`);
      },
      onCancel: () => {
        router.push(`/order/${result.reference}`);
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <div>
        <input
          {...register("customerName")}
          placeholder="Full name"
          className={inputClass}
        />
        {errors.customerName && (
          <p className={errorClass}>{errors.customerName.message}</p>
        )}
      </div>

      <div>
        <input
          {...register("email")}
          type="email"
          placeholder="Email address"
          className={inputClass}
        />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      <div>
        <input
          {...register("phone")}
          type="tel"
          placeholder="Phone number (e.g. 08012345678)"
          className={inputClass}
        />
        {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
      </div>

      <div>
        <input
          {...register("deliveryAddress")}
          placeholder="Delivery address"
          className={inputClass}
        />
        {errors.deliveryAddress && (
          <p className={errorClass}>{errors.deliveryAddress.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <input
            {...register("deliveryCity")}
            placeholder="City"
            className={inputClass}
          />
          {errors.deliveryCity && (
            <p className={errorClass}>{errors.deliveryCity.message}</p>
          )}
        </div>
        <div className="flex-1">
          <input
            {...register("deliveryState")}
            placeholder="State"
            className={inputClass}
          />
          {errors.deliveryState && (
            <p className={errorClass}>{errors.deliveryState.message}</p>
          )}
        </div>
      </div>

      <textarea
        {...register("notes")}
        placeholder="Notes (optional)"
        rows={3}
        className={inputClass}
      />

      {rootError && <p className={errorClass}>{rootError}</p>}

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={isSubmitting ? undefined : { scale: 1.02 }}
        whileTap={isSubmitting ? undefined : { scale: 0.98 }}
        className={`mt-2 ${siteButtonClass("primary", "lg")}`}
      >
        {isSubmitting ? "Preparing payment…" : "Continue to payment"}
      </motion.button>
    </form>
  );
}
