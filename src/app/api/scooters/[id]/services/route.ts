import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  SERVICE_TYPES,
  type ServiceType,
} from "@/modules/services/service-types";
import {
  getServicesByScooter,
  createService,
} from "@/modules/services/services/service-log-service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const services = await getServicesByScooter(session.user.id, id);
  if (services === null)
    return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(services);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const type = body.type as ServiceType;
  const performedAt = body.performedAt ? new Date(body.performedAt) : null;
  if (
    !type ||
    !SERVICE_TYPES.includes(type) ||
    !performedAt ||
    isNaN(performedAt.getTime())
  ) {
    return NextResponse.json(
      { error: "Érvénytelen szerviztípus vagy dátum." },
      { status: 400 },
    );
  }

  const service = await createService(session.user.id, id, {
    type,
    performedAt,
    odometerKm: body.odometerKm ? Number(body.odometerKm) : undefined,
    cost: body.cost ? Number(body.cost) : undefined,
    notes: body.notes ? String(body.notes) : undefined,
  });
  if (service === null)
    return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(service, { status: 201 });
}
