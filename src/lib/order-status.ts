import type { OrderStatus } from "@/lib/db/schema";

/**
 * Whitelist of valid forward transitions. Orders can only move forward
 * through the fulfillment lifecycle — e.g. a delivered order can never be
 * moved back to shipped. "failed" is only reachable from "pending" (a
 * payment that didn't go through); once paid, failure no longer applies.
 */
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid", "failed"],
  paid: ["fulfilled"],
  fulfilled: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  failed: [],
};

export function getAllowedNextStatuses(current: OrderStatus): OrderStatus[] {
  return ALLOWED_TRANSITIONS[current] ?? [];
}

export function isValidTransition(from: OrderStatus, to: OrderStatus): boolean {
  if (from === to) return true;
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}
