export type PaymentMode = "paystack" | "manual";

/**
 * Paystack integration is on pause pending verification — orders default to
 * the WhatsApp-enquiry flow unless PAYMENT_MODE is explicitly "paystack".
 * Flip PAYMENT_MODE=paystack in env once Paystack is verified and ready.
 */
export function getPaymentMode(): PaymentMode {
  return process.env.PAYMENT_MODE === "paystack" ? "paystack" : "manual";
}
