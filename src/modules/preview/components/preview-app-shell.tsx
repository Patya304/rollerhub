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

const NAV_ITEMS = [
  { title: "Áttekintés", url: "/preview/app", icon: LayoutDashboard },
  { title: "Garázs", url: "/preview/app/garage", icon: Bike },
  { title: "Szerviz", url: "/preview/app/service", icon: Wrench },
  { title: "Menetek", url: "/preview/app/rides", icon: Route },
  { title: "Értékbecslés", url: "/preview/app/value", icon: TrendingUp },
  { title: "Tudásközpont", url: "/preview/app/knowledge", icon: BookOpen },
  { title: "Beállítások", url: "/preview/app/settings", icon: Settings },
];

export function PreviewAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (url: string) => {
    if (url === "/preview/app") return pathname === "/preview/app";
    return pathname === url || pathname.startsWith(url + "/");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="bg-sidebar border-sidebar-border hidden w-56 shrink-0 flex-col border-r lg:flex">
        {/* Brand */}
        <div className="border-border/50 border-b px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🛴</span>
            <div>
              <p className="text-sm font-semibold tracking-tight">RollerHub</p>
              <p className="text-muted-foreground text-xs tracking-widest uppercase">
                Digitális garázs
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3">
          <ul className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.url);
              return (
                <li key={item.url}>
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
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer — demo user */}
        <div className="border-border/50 border-t p-3">
          <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
            <div className="bg-primary/20 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
              D
            </div>
            <div className="min-w-0">
              <p className="text-xs leading-tight font-medium">
                Demo Felhasználó
              </p>
              <p className="text-muted-foreground truncate text-xs">
                demo@rollerhub.app
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="border-border/50 flex h-12 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            {/* Mobile brand (sidebar hidden on mobile) */}
            <span className="text-muted-foreground text-xs font-medium tracking-widest uppercase lg:hidden">
              🛴 RollerHub
            </span>
            <span className="text-muted-foreground hidden text-xs font-medium tracking-widest uppercase lg:block">
              RollerHub
            </span>
          </div>
          <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium">
            Demo mód · nincs valódi adat
          </span>
        </header>

        {/* Mobile nav */}
        <nav className="border-border/50 flex gap-1 overflow-x-auto border-b px-3 py-2 lg:hidden">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.url);
            return (
              <Link
                key={item.url}
                href={item.url}
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Content */}
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
