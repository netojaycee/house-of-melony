import { auth, signOut } from "@/lib/auth";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

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

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <SidebarProvider className="min-h-full flex-1">
      <AdminSidebar onLogout={logout} />
      <SidebarInset className="bg-background">
        <header className="flex items-center gap-2 border-b border-melony-gold/15 px-4 py-3">
          <SidebarTrigger />
        </header>
        <div className="flex-1 p-6 sm:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
