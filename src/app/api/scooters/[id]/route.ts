import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  getScooterDetails,
  updateScooter,
  deleteScooter,
} from "@/modules/garage/services/scooter-service";
import { updateScooterSchema } from "@/modules/garage/schemas/scooter-schema";

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
  const scooter = await getScooterDetails(session.user.id, id);
  if (!scooter)
    return NextResponse.json({ error: "Nem található." }, { status: 404 });
  return NextResponse.json(scooter);
}

export async function PATCH(
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

  const parsed = updateScooterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Érvénytelen adatok." },
      { status: 400 },
    );
  }

  const count = await updateScooter(session.user.id, id, parsed.data);
  if (count === 0) {
    return NextResponse.json({ error: "Nem található." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
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
  const count = await deleteScooter(session.user.id, id);
  if (count === 0) {
    return NextResponse.json({ error: "Nem található." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
