import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  getScootersByUser,
  createScooter,
} from "@/modules/garage/services/scooter-service";
import { createScooterSchema } from "@/modules/garage/schemas/scooter-schema";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json(
      { error: "Bejelentkezés szükséges." },
      { status: 401 },
    );
  }
  const scooters = await getScootersByUser(session.user.id);
  return NextResponse.json(scooters);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json(
      { error: "Bejelentkezés szükséges." },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Érvénytelen kérés." }, { status: 400 });
  }

  const parsed = createScooterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Érvénytelen adatok." },
      { status: 400 },
    );
  }

  const scooter = await createScooter(session.user.id, parsed.data);
  return NextResponse.json(scooter, { status: 201 });
}
