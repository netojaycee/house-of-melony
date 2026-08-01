"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { trackOrder } from "@/app/actions/track";
import { trackOrderSchema, type TrackOrderInput } from "@/lib/validation/track-order";
import { siteButtonClass } from "@/lib/site-button";

const inputClass =
  "w-full rounded-lg border border-melony-gold/25 bg-melony-black px-4 py-3 text-melony-cream placeholder:text-melony-cream/30 focus:border-melony-gold focus:outline-none";
const errorClass = "mt-1 text-sm text-red-400";

export function TrackOrderForm() {
  const router = useRouter();
  const [rootError, setRootError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrackOrderInput>({ resolver: zodResolver(trackOrderSchema) });

  async function onSubmit(data: TrackOrderInput) {
    setRootError(null);
    const result = await trackOrder(data);
    if (result.status === "error") {
      setRootError(result.message);
      return;
    }
    router.push(`/order/${result.orderNumber}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div>
        <input
          {...register("orderNumber")}
          placeholder="Order number (e.g. HOM-6EDCA5F8)"
          className={inputClass}
        />
        {errors.orderNumber && <p className={errorClass}>{errors.orderNumber.message}</p>}
      </div>

      <div>
        <input
          {...register("email")}
          type="email"
          placeholder="Email used at checkout"
          className={inputClass}
        />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      {rootError && <p className={errorClass}>{rootError}</p>}

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={isSubmitting ? undefined : { scale: 1.02 }}
        whileTap={isSubmitting ? undefined : { scale: 0.98 }}
        className={`mt-2 ${siteButtonClass("primary", "lg")}`}
      >
        {isSubmitting ? "Looking up…" : "Track order"}
      </motion.button>
    </form>
  );
}
