import { z } from "zod";

export const checkoutSchema = z.object({
  variantId: z.uuid(),
  qty: z.coerce.number().int().min(1).max(10),
  customerName: z.string().trim().min(2).max(120),
  email: z.email().max(200),
  phone: z
    .string()
    .trim()
    .regex(/^(\+234|0)[789][01]\d{8}$/, "Enter a valid Nigerian phone number"),
  deliveryAddress: z.string().trim().min(6).max(300),
  deliveryCity: z.string().trim().min(2).max(100),
  deliveryState: z.string().trim().min(2).max(100),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
