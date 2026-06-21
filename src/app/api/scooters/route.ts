import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  getScootersByUser,
  createScooter,
} from "@/modules/garage/services/scooter-service";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const scooters = await getScootersByUser(session.user.id);
  return NextResponse.json(scooters);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const brand = String(body.brand ?? "").trim();
  const model = String(body.model ?? "").trim();
  if (!brand || !model) {
    return NextResponse.json(
      { error: "A márka és a modell kötelező." },
      { status: 400 },
    );
  }

  const scooter = await createScooter(session.user.id, {
    brand,
    model,
    color: body.color ? String(body.color) : undefined,
    serialNumber: body.serialNumber ? String(body.serialNumber) : undefined,
    year: body.year ? Number(body.year) : undefined,
    currentMileage: body.currentMileage
      ? Number(body.currentMileage)
      : undefined,
    purchasePrice: body.purchasePrice ? Number(body.purchasePrice) : undefined,
    batteryCapacity: body.batteryCapacity
      ? Number(body.batteryCapacity)
      : undefined,
    topSpeed: body.topSpeed ? Number(body.topSpeed) : undefined,
    rangeKm: body.rangeKm ? Number(body.rangeKm) : undefined,
    photoUrl: body.photoUrl ? String(body.photoUrl) : undefined,
    notes: body.notes ? String(body.notes) : undefined,
  });

  return NextResponse.json(scooter, { status: 201 });
}
