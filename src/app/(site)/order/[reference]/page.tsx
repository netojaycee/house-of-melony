import { notFound } from "next/navigation";
import { getOrderByReference } from "@/lib/data/orders";
import { formatNaira } from "@/lib/data/product";
import { PendingPoller } from "@/components/order/pending-poller";

export const metadata = { title: "Order status" };

const statusCopy: Record<string, { heading: string; body: string }> = {
  pending: {
    heading: "Confirming your payment…",
    body: "This usually takes a few seconds. Please don't close this page.",
  },
  paid: {
    heading: "Thank you — your order is confirmed!",
    body: "A confirmation email is on its way. We'll begin preparing your Òkè Wúrà set.",
  },
  fulfilled: {
    heading: "Your order is being prepared.",
    body: "We're hand-finishing your Òkè Wúrà set.",
  },
  shipped: {
    heading: "Your order is on its way!",
    body: "Your Òkè Wúrà set has shipped.",
  },
  failed: {
    heading: "Payment didn't go through.",
    body: "No charge was made. Please go back and try again, or reach out if you keep having trouble.",
  },
};

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const result = await getOrderByReference(reference);
  if (!result) notFound();
  const { order, variant, product } = result;

  const copy = statusCopy[order.status] ?? statusCopy.pending;

  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <PendingPoller status={order.status} />
      <p className="text-sm tracking-[0.25em] text-melony-gold uppercase">
        Order {order.orderNumber}
      </p>
      <h1 className="font-display mt-3 text-3xl text-melony-cream">
        {copy.heading}
      </h1>
      <p className="mt-3 text-melony-cream/70">{copy.body}</p>

      <div className="mt-10 rounded-2xl border border-melony-gold/15 bg-melony-black-soft p-6 text-left">
        <p className="text-melony-cream">
          {product?.name ?? "Òkè Wúrà Set"} — {variant?.label} × {order.qty}
        </p>
        <p className="mt-1 text-sm text-melony-cream/60">
          {order.deliveryAddress}, {order.deliveryCity}, {order.deliveryState}
        </p>
        <p className="font-display mt-4 text-xl text-melony-gold">
          {formatNaira(order.amountKobo)}
        </p>
      </div>
    </main>
  );
}
