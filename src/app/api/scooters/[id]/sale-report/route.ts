import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  createOrReactivateShare,
  refreshShare,
  revokeShare,
} from "@/modules/sale-report/services/sale-report-service";

async function requireSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json(
      { error: "Bejelentkezés szükséges." },
      { status: 401 },
    );
  }

  const { id } = await params;
  const result = await createOrReactivateShare(session.user.id, id);

  if (result.status === "not_found") {
    return NextResponse.json({ error: "Nem található." }, { status: 404 });
  }
  if (result.status === "not_ready") {
    return NextResponse.json(
      {
        error: "Nincs elég adat a megosztáshoz.",
        missingRequired: result.missingRequired,
      },
      { status: 400 },
    );
  }
  return NextResponse.json({
    publicToken: result.publicToken,
    updatedAt: result.updatedAt,
  });
}

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json(
      { error: "Bejelentkezés szükséges." },
      { status: 401 },
    );
  }

  const { id } = await params;
  const result = await refreshShare(session.user.id, id);

  if (result.status === "not_found") {
    return NextResponse.json(
      { error: "Nem található aktív megosztás." },
      { status: 404 },
    );
  }
  if (result.status === "not_ready") {
    return NextResponse.json(
      {
        error: "A roller jelenleg nem osztható meg.",
        missingRequired: result.missingRequired,
      },
      { status: 400 },
    );
  }
  return NextResponse.json({
    publicToken: result.publicToken,
    updatedAt: result.updatedAt,
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json(
      { error: "Bejelentkezés szükséges." },
      { status: 401 },
    );
  }

  const { id } = await params;
  const result = await revokeShare(session.user.id, id);

  if (result.status === "not_found") {
    return NextResponse.json(
      { error: "Nem található aktív megosztás." },
      { status: 404 },
    );
  }
  return NextResponse.json({ ok: true });
}
