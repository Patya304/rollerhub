"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await signOut();
        router.push("/sign-in");
        router.refresh();
      }}
      className="text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"
    >
      <LogOut className="h-4 w-4 shrink-0" />
      <span>Kilépés</span>
    </button>
  );
}
