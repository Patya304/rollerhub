import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  getRidesByScooter,
  createRide,
} from "@/modules/rides/services/ride-service";
import { createRideSchema } from "@/modules/rides/schemas/ride-schema";

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
  const rides = await getRidesByScooter(session.user.id, id);
  if (rides === null)
    return NextResponse.json({ error: "Nem található." }, { status: 404 });
  return NextResponse.json(rides);
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

  const parsed = createRideSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ?? "Az indulás időpontja kötelező.",
      },
      { status: 400 },
    );
  }

  const ride = await createRide(session.user.id, id, {
    startAt: parsed.data.startAt,
    endAt: parsed.data.endAt,
    distanceKm: parsed.data.distanceKm,
    avgSpeed: parsed.data.avgSpeed,
    maxSpeed: parsed.data.maxSpeed,
  });
  if (ride === null)
    return NextResponse.json({ error: "Nem található." }, { status: 404 });
  return NextResponse.json(ride, { status: 201 });
}
