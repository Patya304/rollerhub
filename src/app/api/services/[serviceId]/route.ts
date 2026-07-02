import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { deleteService } from "@/modules/services/services/service-log-service";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json(
      { error: "Bejelentkezés szükséges." },
      { status: 401 },
    );

  const { serviceId } = await params;
  const count = await deleteService(session.user.id, serviceId);
  if (count === 0)
    return NextResponse.json({ error: "Nem található." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
