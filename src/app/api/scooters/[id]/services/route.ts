import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  getServicesByScooter,
  createService,
} from "@/modules/services/services/service-log-service";
import { createServiceSchema } from "@/modules/services/schemas/service-schema";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json(
      { error: "Bejelentkezés szükséges." },
      { status: 401 },
    );

  const { id } = await params;
  const services = await getServicesByScooter(session.user.id, id);
  if (services === null)
    return NextResponse.json({ error: "Nem található." }, { status: 404 });
  return NextResponse.json(services);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json(
      { error: "Bejelentkezés szükséges." },
      { status: 401 },
    );

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Érvénytelen kérés." }, { status: 400 });
  }

  const parsed = createServiceSchema.safeParse(body);
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

  const service = await createService(session.user.id, id, {
    type: parsed.data.type,
    performedAt: parsed.data.performedAt,
    odometerKm: parsed.data.odometerKm,
    cost: parsed.data.cost,
    notes: parsed.data.notes,
  });
  if (service === null)
    return NextResponse.json({ error: "Nem található." }, { status: 404 });
  return NextResponse.json(service, { status: 201 });
}
