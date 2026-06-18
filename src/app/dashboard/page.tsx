import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/modules/auth/components/sign-out-button";
import { Garage } from "@/modules/garage/components/garage";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Garázs</h1>
        <SignOutButton />
      </div>
      <p className="text-muted-foreground mt-2 mb-8 text-sm">
        Be vagy lépve: {session.user.email}
      </p>
      <Garage />
    </main>
  );
}
