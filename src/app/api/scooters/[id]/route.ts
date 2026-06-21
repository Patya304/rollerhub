import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  getScooterDetails,
  updateScooter,
  deleteScooter,
} from "@/modules/garage/services/scooter-service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const scooter = await getScooterDetails(session.user.id, id);
  if (!scooter)
    return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(scooter);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const data: {
    brand?: string;
    model?: string;
    color?: string | null;
    serialNumber?: string | null;
    year?: number | null;
    currentMileage?: number;
    batteryCapacity?: number | null;
    topSpeed?: number | null;
    rangeKm?: number | null;
    photoUrl?: string | null;
    notes?: string | null;
  } = {};
  if (body.brand !== undefined) data.brand = String(body.brand).trim();
  if (body.model !== undefined) data.model = String(body.model).trim();
  if (body.color !== undefined)
    data.color = body.color ? String(body.color) : null;
  if (body.serialNumber !== undefined)
    data.serialNumber = body.serialNumber ? String(body.serialNumber) : null;
  if (body.year !== undefined) data.year = body.year ? Number(body.year) : null;
  if (body.currentMileage !== undefined)
    data.currentMileage = Number(body.currentMileage) || 0;
  if (body.batteryCapacity !== undefined)
    data.batteryCapacity = body.batteryCapacity
      ? Number(body.batteryCapacity)
      : null;
  if (body.topSpeed !== undefined)
    data.topSpeed = body.topSpeed ? Number(body.topSpeed) : null;
  if (body.rangeKm !== undefined)
    data.rangeKm = body.rangeKm ? Number(body.rangeKm) : null;
  if (body.photoUrl !== undefined)
    data.photoUrl = body.photoUrl ? String(body.photoUrl) : null;
  if (body.notes !== undefined)
    data.notes = body.notes ? String(body.notes) : null;

  const count = await updateScooter(session.user.id, id, data);
  if (count === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const count = await deleteScooter(session.user.id, id);
  if (count === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
