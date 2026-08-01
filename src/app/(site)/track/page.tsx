import { TrackOrderForm } from "@/components/track/track-order-form";

export const metadata = {
  title: "Track your order",
  robots: { index: false, follow: false },
};

export default function TrackOrderPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <p className="text-sm tracking-[0.25em] text-melony-gold uppercase">
        House of Melony
      </p>
      <h1 className="font-display mt-3 text-3xl text-melony-cream">
        Track your order
      </h1>
      <p className="mt-3 text-melony-cream/70">
        Enter your order number and the email you used at checkout.
      </p>
      <div className="mt-8">
        <TrackOrderForm />
      </div>
    </main>
  );
}
