"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bike,
  Wrench,
  Route,
  TrendingUp,
  BookOpen,
  Settings,
} from "lucide-react";
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
import { SignOutButton } from "@/modules/auth/components/sign-out-button";

const items = [
  { title: "Áttekintés", url: "/dashboard", icon: LayoutDashboard },
  { title: "Garázs", url: "/garage", icon: Bike },
  { title: "Szerviz", url: "/service", icon: Wrench },
  { title: "Menetek", url: "/rides", icon: Route },
  { title: "Értékbecslés", url: "/value", icon: TrendingUp },
  { title: "Tudásközpont", url: "/knowledge", icon: BookOpen },
  { title: "Beállítások", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (url: string) =>
    pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-3 text-lg font-semibold">
        🛴 RollerHub
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        <SignOutButton />
      </SidebarFooter>
    </Sidebar>
  );
}
