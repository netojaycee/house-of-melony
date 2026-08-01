"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutList, Shirt, Settings, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/admin", label: "Orders", icon: LayoutList },
  { href: "/admin/product", label: "Product", icon: Shirt },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({
  onLogout,
}: {
  onLogout: () => Promise<void>;
}) {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="px-3 py-4">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/brand/logo.jpeg"
            alt="House of Melony"
            width={28}
            height={28}
            className="rounded-full"
          />
          <span className="font-display text-base text-sidebar-foreground">
            House of Melony
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      render={<Link href={item.href} />}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={onLogout}>
              <SidebarMenuButton type="submit">
                <LogOut />
                <span>Log out</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
