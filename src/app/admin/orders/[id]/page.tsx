import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/lib/data/orders";
import { formatNaira } from "@/lib/data/product";
import { OrderStatusForm } from "@/components/admin/order-status-form";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getOrderById(id);
  if (!result) notFound();
  const { order, variant, product } = result;

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <Link href="/admin" className="text-sm text-melony-cream/50 hover:text-melony-gold">
        ← Back to orders
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-melony-cream">
          {order.orderNumber}
        </h1>
        <OrderStatusForm orderId={order.id} status={order.status} />
      </div>

      <div className="rounded-xl border border-melony-gold/15 p-5">
        <p className="text-melony-cream">
          {product?.name ?? "Òkè Wúrà Set"} — {variant?.label} × {order.qty}
        </p>
        <p className="mt-1 text-melony-gold">{formatNaira(order.amountKobo)}</p>
        <p className="mt-1 text-xs text-melony-cream/40">
          Ref: {order.paystackReference}
        </p>
      </div>

      <div className="rounded-xl border border-melony-gold/15 p-5 text-sm text-melony-cream/80">
        <p className="mb-2 text-melony-cream/50">Customer</p>
        <p>{order.customerName}</p>
        <p>{order.email}</p>
        <p>{order.phone}</p>
        <p className="mt-3 text-melony-cream/50">Delivery</p>
        <p>
          {order.deliveryAddress}, {order.deliveryCity}, {order.deliveryState}
        </p>
        {order.notes && (
          <>
            <p className="mt-3 text-melony-cream/50">Notes</p>
            <p>{order.notes}</p>
          </>
        )}
      </div>
    </div>
  );
}
