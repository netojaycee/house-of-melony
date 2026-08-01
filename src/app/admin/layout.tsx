import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return <div className="flex min-h-full flex-1 flex-col">{children}</div>;
  }

  return (
    <div className="flex min-h-full flex-1">
      <aside className="flex w-56 shrink-0 flex-col border-r border-melony-gold/15 bg-melony-black-soft p-6">
        <p className="font-display mb-8 text-lg text-melony-cream">
          House of Melony
        </p>
        <nav className="flex flex-col gap-3 text-sm">
          <Link href="/admin" className="text-melony-cream/80 hover:text-melony-gold">
            Orders
          </Link>
          <Link href="/admin/product" className="text-melony-cream/80 hover:text-melony-gold">
            Product
          </Link>
          <Link href="/admin/settings" className="text-melony-cream/80 hover:text-melony-gold">
            Settings
          </Link>
        </nav>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
          className="mt-auto pt-6"
        >
          <button
            type="submit"
            className="text-sm text-melony-cream/50 hover:text-melony-gold"
          >
            Log out
          </button>
        </form>
      </aside>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
