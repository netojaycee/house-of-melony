import { z } from "zod";

export const checkoutSchema = z.object({
  variantId: z.uuid(),
  qty: z.coerce.number().int().min(1).max(10),
  customerName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(120),
  email: z.email("Please enter a valid email address").max(200),
  phone: z
    .string()
    .trim()
    .regex(/^(\+234|0)[789][01]\d{8}$/, "Enter a valid Nigerian phone number"),
  deliveryAddress: z
    .string()
    .trim()
    .min(6, "Please enter a more complete delivery address")
    .max(300),
  deliveryCity: z.string().trim().min(2, "Please enter a city").max(100),
  deliveryState: z.string().trim().min(2, "Please enter a state").max(100),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
// Raw shape RHF works with before the qty coercion runs (z.coerce.number()
// accepts unknown on input but produces number on output).
export type CheckoutFormValues = z.input<typeof checkoutSchema>;
