import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { BodyTheme } from "@/components/body-theme";
import { getUserSettings } from "@/modules/settings/services/settings-service";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/sign-in");
  }

  const user = await getUserSettings(session.user.id);
  const theme = user?.theme ?? "default";

  return (
    <div
      data-theme={theme}
      className="bg-background text-foreground min-h-screen"
    >
      <BodyTheme theme={theme} />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="border-border/50 flex h-12 items-center gap-2 border-b px-4">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <span className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
              RollerHub
            </span>
          </header>
          <div className="p-4 sm:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
