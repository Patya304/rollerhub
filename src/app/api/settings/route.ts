import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { updateUserSettings } from "@/modules/settings/services/settings-service";
import { updateSettingsSchema } from "@/modules/settings/schemas/settings-schema";

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Érvénytelen kérés." }, { status: 400 });
  }

  const parsed = updateSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Érvénytelen adatok." },
      { status: 400 },
    );
  }

  const result = await updateUserSettings(session.user.id, parsed.data);
  if (result.status === "username_taken") {
    return NextResponse.json(
      { error: "Ez a felhasználónév már foglalt." },
      { status: 409 },
    );
  }

  return NextResponse.json({ ok: true });
}
