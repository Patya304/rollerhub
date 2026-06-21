import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  getRidesByScooter,
  createRide,
} from "@/modules/rides/services/ride-service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const rides = await getRidesByScooter(session.user.id, id);
  if (rides === null)
    return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(rides);
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

  const startAt = body.startAt ? new Date(body.startAt) : null;
  if (!startAt || isNaN(startAt.getTime())) {
    return NextResponse.json(
      { error: "Az indulás időpontja kötelező." },
      { status: 400 },
    );
  }
  const endAt = body.endAt ? new Date(body.endAt) : null;
  if (endAt && isNaN(endAt.getTime())) {
    return NextResponse.json(
      { error: "Érvénytelen befejezési időpont." },
      { status: 400 },
    );
  }

  const ride = await createRide(session.user.id, id, {
    startAt,
    endAt: endAt ?? undefined,
    distanceKm: body.distanceKm ? Number(body.distanceKm) : undefined,
    avgSpeed: body.avgSpeed ? Number(body.avgSpeed) : undefined,
    maxSpeed: body.maxSpeed ? Number(body.maxSpeed) : undefined,
  });
  if (ride === null)
    return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(ride, { status: 201 });
}
