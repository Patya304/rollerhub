import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  updateScooter,
  deleteScooter,
} from "@/modules/garage/services/scooter-service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const data: {
    brand?: string;
    model?: string;
    year?: number | null;
    currentMileage?: number;
    notes?: string | null;
  } = {};
  if (body.brand !== undefined) data.brand = String(body.brand).trim();
  if (body.model !== undefined) data.model = String(body.model).trim();
  if (body.year !== undefined) data.year = body.year ? Number(body.year) : null;
  if (body.currentMileage !== undefined)
    data.currentMileage = Number(body.currentMileage) || 0;
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
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const count = await deleteScooter(session.user.id, id);
  if (count === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
