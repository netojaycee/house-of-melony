"use server";

import { headers } from "next/headers";
import { trackOrderSchema } from "@/lib/validation/track-order";
import { findOrderForTracking } from "@/lib/data/orders";
import { checkRateLimit } from "@/lib/rate-limit";

export type TrackOrderResult =
  | { status: "error"; message: string }
  | { status: "success"; orderNumber: string };

export async function trackOrder(input: unknown): Promise<TrackOrderResult> {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const { success } = await checkRateLimit(`track:${ip}`);
  if (!success) {
    return {
      status: "error",
      message: "Too many attempts. Please wait a moment and try again.",
    };
  }

  const parsed = trackOrderSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check your details.",
    };
  }

  const order = await findOrderForTracking(
    parsed.data.orderNumber,
    parsed.data.email,
  );

  if (!order) {
    return {
      status: "error",
      message: "We couldn't find an order matching that number and email.",
    };
  }

  return { status: "success", orderNumber: order.orderNumber };
}
