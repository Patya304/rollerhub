import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { deleteRide } from "@/modules/rides/services/ride-service";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ rideId: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { rideId } = await params;
  const count = await deleteRide(session.user.id, rideId);
  if (count === 0)
    return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
