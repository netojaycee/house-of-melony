import { resend } from "./resend";
import OrderConfirmationEmail from "./templates/order-confirmation";
import OrderNotificationEmail from "./templates/order-notification";

/**
 * Falls back to Resend's shared sandbox sender until a custom domain is
 * verified in Resend (required before EMAIL_FROM can use @houseofmelony.com
 * or any other custom domain).
 */
function emailFrom(): string {
  return "House of Melony " + (process.env.EMAIL_FROM ?? "House of Melony <noreply@johnedeh.com>");
}

type OrderEmailPayload = {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  productName: string;
  variantLabel: string;
  qty: number;
  amountKobo: number;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  notes?: string | null;
};

export async function sendOrderEmails(payload: OrderEmailPayload) {
  const amountNaira = payload.amountKobo / 100;
  const fullAddress = `${payload.deliveryAddress}, ${payload.deliveryCity}, ${payload.deliveryState}`;
  const notificationTo = process.env.ORDER_NOTIFICATION_EMAIL;

  const results = await Promise.allSettled([
    resend().emails.send({
      from: emailFrom(),
      to: payload.email,
      subject: `Order confirmed — ${payload.orderNumber}`,
      react: OrderConfirmationEmail({
        customerName: payload.customerName,
        orderNumber: payload.orderNumber,
        productName: payload.productName,
        variantLabel: payload.variantLabel,
        qty: payload.qty,
        amountNaira,
        deliveryAddress: fullAddress,
      }),
    }),
    notificationTo
      ? resend().emails.send({
          from: emailFrom(),
          to: notificationTo,
          subject: `New paid order — ${payload.orderNumber}`,
          react: OrderNotificationEmail({
            orderNumber: payload.orderNumber,
            customerName: payload.customerName,
            email: payload.email,
            phone: payload.phone,
            productName: payload.productName,
            variantLabel: payload.variantLabel,
            qty: payload.qty,
            amountNaira,
            deliveryAddress: payload.deliveryAddress,
            deliveryCity: payload.deliveryCity,
            deliveryState: payload.deliveryState,
            notes: payload.notes,
          }),
        })
      : Promise.resolve(null),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Failed to send order email:", result.reason);
    }
  }
}
