import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  deleteService,
  updateService,
} from "@/modules/services/services/service-log-service";
import { updateServiceSchema } from "@/modules/services/schemas/service-schema";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json(
      { error: "Bejelentkezés szükséges." },
      { status: 401 },
    );

  const { serviceId } = await params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Érvénytelen kérés." }, { status: 400 });
  }

  const parsed = updateServiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ??
          "Érvénytelen szerviztípus vagy dátum.",
      },
      { status: 400 },
    );
  }

  const count = await updateService(session.user.id, serviceId, parsed.data);
  if (count === 0)
    return NextResponse.json({ error: "Nem található." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json(
      { error: "Bejelentkezés szükséges." },
      { status: 401 },
    );

  const { serviceId } = await params;
  const count = await deleteService(session.user.id, serviceId);
  if (count === 0)
    return NextResponse.json({ error: "Nem található." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
