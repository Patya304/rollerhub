import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { upsertOwnerCondition } from "@/modules/sale-report/services/condition-service";

async function requireSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function PUT(
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
  if (!body) {
    return NextResponse.json(
      { error: "Hibás kérés formátum." },
      { status: 400 },
    );
  }

  const { id } = await params;

  try {
    const result = await upsertOwnerCondition(session.user.id, id, body);

    if (result.status === "not_found") {
      return NextResponse.json({ error: "Nem található." }, { status: 404 });
    }
    if (result.status === "invalid") {
      return NextResponse.json(
        {
          error: "Hibás vagy hiányzó adat az állapotfelmérésben.",
          fieldErrors: result.fieldErrors,
        },
        { status: 400 },
      );
    }
    return NextResponse.json({ condition: result.condition });
  } catch {
    // Prisma vagy egyéb váratlan hiba SOHA nem jut a kliensre technikai
    // részletként (stack trace, SQL, belső ID) - csak egy rövid, semleges
    // magyar üzenet.
    return NextResponse.json(
      { error: "Nem sikerült menteni az állapotfelmérést." },
      { status: 500 },
    );
  }
}
