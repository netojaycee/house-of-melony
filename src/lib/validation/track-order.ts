import { z } from "zod";

export const trackOrderSchema = z.object({
  orderNumber: z.string().trim().min(4, "Enter your order number"),
  email: z.email("Enter a valid email address"),
});

export type TrackOrderInput = z.infer<typeof trackOrderSchema>;
