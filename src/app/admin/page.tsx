import Link from "next/link";
import { listOrders } from "@/lib/data/orders";
import { formatNaira } from "@/lib/data/product";

const paidStatuses = new Set(["paid", "fulfilled", "shipped"]);

const statusStyles: Record<string, string> = {
  pending: "text-melony-cream/50",
  paid: "text-melony-gold",
  fulfilled: "text-melony-gold-light",
  shipped: "text-green-400",
  failed: "text-red-400",
};

export default async function AdminOrdersPage() {
  const allOrders = await listOrders();

  const paidOrders = allOrders.filter((o) => paidStatuses.has(o.status));
  const revenueKobo = paidOrders.reduce((sum, o) => sum + o.amountKobo, 0);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl text-melony-cream">Orders</h1>
        <div className="mt-4 flex gap-6 text-sm text-melony-cream/70">
          <p>
            <span className="text-melony-gold">{allOrders.length}</span> total
            orders
          </p>
          <p>
            <span className="text-melony-gold">{paidOrders.length}</span> paid
          </p>
          <p>
            <span className="text-melony-gold">
              {formatNaira(revenueKobo)}
            </span>{" "}
            revenue
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-melony-gold/15">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-melony-gold/15 text-melony-cream/50">
            <tr>
              <th className="px-4 py-3 font-normal">Order</th>
              <th className="px-4 py-3 font-normal">Customer</th>
              <th className="px-4 py-3 font-normal">Amount</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Date</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-melony-gold/10 last:border-0"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-melony-cream hover:text-melony-gold"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-melony-cream/80">
                  {order.customerName}
                </td>
                <td className="px-4 py-3 text-melony-cream/80">
                  {formatNaira(order.amountKobo)}
                </td>
                <td className={`px-4 py-3 ${statusStyles[order.status] ?? ""}`}>
                  {order.status}
                </td>
                <td className="px-4 py-3 text-melony-cream/50">
                  {order.createdAt.toLocaleDateString("en-NG")}
                </td>
              </tr>
            ))}
            {allOrders.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-melony-cream/40"
                >
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
