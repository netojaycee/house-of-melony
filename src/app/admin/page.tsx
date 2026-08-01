import Link from "next/link";
import { listOrders } from "@/lib/data/orders";
import { formatNaira } from "@/lib/data/product";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const paidStatuses = new Set(["paid", "fulfilled", "shipped"]);

const statusVariants: Record<string, string> = {
  pending: "bg-melony-cream/10 text-melony-cream/70",
  paid: "bg-melony-gold/15 text-melony-gold",
  fulfilled: "bg-melony-gold-light/15 text-melony-gold-light",
  shipped: "bg-green-500/15 text-green-400",
  failed: "bg-red-500/15 text-red-400",
};

export default async function AdminOrdersPage() {
  const allOrders = await listOrders();

  const paidOrders = allOrders.filter((o) => paidStatuses.has(o.status));
  const revenueKobo = paidOrders.reduce((sum, o) => sum + o.amountKobo, 0);

  const stats = [
    { label: "Total orders", value: allOrders.length },
    { label: "Paid", value: paidOrders.length },
    { label: "Revenue", value: formatNaira(revenueKobo) },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl text-melony-cream">Orders</h1>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-melony-gold/15 bg-melony-black-soft p-4"
            >
              <p className="text-xs tracking-[0.15em] text-melony-cream/50 uppercase">
                {stat.label}
              </p>
              <p className="font-display mt-1 text-2xl text-melony-gold">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-melony-gold/15">
        <Table>
          <TableHeader>
            <TableRow className="border-melony-gold/15 hover:bg-transparent">
              <TableHead className="text-melony-cream/50">Order</TableHead>
              <TableHead className="text-melony-cream/50">Customer</TableHead>
              <TableHead className="text-melony-cream/50">Amount</TableHead>
              <TableHead className="text-melony-cream/50">Status</TableHead>
              <TableHead className="text-melony-cream/50">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allOrders.map((order) => (
              <TableRow
                key={order.id}
                className="border-melony-gold/10 hover:bg-melony-gold/5"
              >
                <TableCell>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-melony-cream hover:text-melony-gold"
                  >
                    {order.orderNumber}
                  </Link>
                </TableCell>
                <TableCell className="text-melony-cream/80">
                  {order.customerName}
                </TableCell>
                <TableCell className="text-melony-cream/80">
                  {formatNaira(order.amountKobo)}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${statusVariants[order.status] ?? ""} border-0`}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-melony-cream/50">
                  {order.createdAt.toLocaleDateString("en-NG")}
                </TableCell>
              </TableRow>
            ))}
            {allOrders.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-melony-cream/40"
                >
                  No orders yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
