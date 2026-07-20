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

// Biztonságos felső korlát a publikus tokenre - a ténylegesen generált
// tokenek (base64url, 32 bájt) ennél jóval rövidebbek, de nem akarunk
// tetszőlegesen hosszú stringet a DB lekérdezésbe engedni. A token maga
// SOHA nem kerül logba vagy hibaüzenetbe.
const MAX_TOKEN_LENGTH = 512;

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
  if (result.status === "conflict") {
    return NextResponse.json(
      { error: "Az adatok közben megváltoztak. Próbáld újra." },
      { status: 409 },
    );
  }
  return NextResponse.json({
    publicToken: result.publicToken,
    publishedAt: result.publishedAt,
    createdOrReactivated: result.createdOrReactivated ?? false,
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
  if (result.status === "conflict") {
    return NextResponse.json(
      { error: "Az adatok közben megváltoztak. Próbáld újra." },
      { status: 409 },
    );
  }
  return NextResponse.json({
    publicToken: result.publicToken,
    publishedAt: result.publishedAt,
    alreadyUpToDate: result.alreadyUpToDate ?? false,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json(
      { error: "Bejelentkezés szükséges." },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => null);
  const publicToken = body?.publicToken;
  if (
    typeof publicToken !== "string" ||
    publicToken.length === 0 ||
    publicToken.length > MAX_TOKEN_LENGTH
  ) {
    return NextResponse.json(
      { error: "Hibás vagy hiányzó token." },
      { status: 400 },
    );
  }

  const { id } = await params;
  const result = await revokeShare(session.user.id, id, publicToken);

  if (result.status === "not_found") {
    return NextResponse.json(
      { error: "Nem található aktív megosztás." },
      { status: 404 },
    );
  }
  return NextResponse.json({ ok: true });
}
