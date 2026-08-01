import { randomBytes } from "crypto";

export function generateOrderNumber(): string {
  const suffix = randomBytes(4).toString("hex").toUpperCase();
  return `HOM-${suffix}`;
}

export function generatePaystackReference(): string {
  const suffix = randomBytes(8).toString("hex");
  return `hom_${Date.now()}_${suffix}`;
}
