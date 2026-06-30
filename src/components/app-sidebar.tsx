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
      <SidebarHeader className="border-border/50 border-b px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🛴</span>
          <div>
            <p className="text-sm font-semibold tracking-tight">RollerHub</p>
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Digitális garázs
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {items.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <Link
                      href={item.url}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                      }`}
                    >
                      <item.icon
                        className={`h-4 w-4 shrink-0 ${active ? "text-primary" : ""}`}
                      />
                      <span>{item.title}</span>
                      {active && (
                        <span className="bg-primary ml-auto h-1.5 w-1.5 rounded-full" />
                      )}
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-border/50 border-t p-3">
        <SignOutButton />
      </SidebarFooter>
    </Sidebar>
  );
}
