"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/app/actions/admin";
import { orderStatusValues, type OrderStatus } from "@/lib/db/schema";

export function OrderStatusForm({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as OrderStatus;
        startTransition(() => {
          updateOrderStatus(orderId, next);
        });
      }}
      className="rounded-lg border border-melony-gold/25 bg-melony-black px-3 py-2 text-melony-cream"
    >
      {orderStatusValues.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
