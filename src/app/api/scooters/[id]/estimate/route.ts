import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { estimateScooterValue } from "@/modules/value/services/value-service";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const result = await estimateScooterValue(session.user.id, id);

  if (result.status === "not_found") {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (result.status === "no_price") {
    return NextResponse.json(
      { error: "Adj meg vételárat a becsléshez." },
      { status: 400 },
    );
  }

  return NextResponse.json({ estimatedValue: result.estimatedValue });
}
