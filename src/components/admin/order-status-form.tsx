"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/actions/admin";
import type { OrderStatus } from "@/lib/db/schema";
import { getAllowedNextStatuses } from "@/lib/order-status";

export function OrderStatusForm({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<OrderStatus>(status);
  const [error, setError] = useState<string | null>(null);

  const nextOptions = getAllowedNextStatuses(status);
  const options: OrderStatus[] = [status, ...nextOptions];

  function handleUpdate() {
    if (selected === status) return;
    setError(null);
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, selected);
      if (result.status === "error") {
        setError(result.message);
        setSelected(status);
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <select
          value={selected}
          disabled={isPending}
          onChange={(e) => setSelected(e.target.value as OrderStatus)}
          className="rounded-lg border border-melony-gold/25 bg-melony-black px-3 py-2 text-melony-cream disabled:opacity-60"
        >
          {options.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={isPending || selected === status}
          onClick={handleUpdate}
          className="rounded-lg bg-melony-gold px-4 py-2 text-sm font-medium text-melony-black transition-colors hover:bg-melony-gold-light disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPending ? "Updating…" : "Update status"}
        </button>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {nextOptions.length === 0 && (
        <p className="text-xs text-melony-cream/40">
          This order has reached its final status.
        </p>
      )}
    </div>
  );
}
