import { NextRequest, NextResponse } from "next/server";

/**
 * PATCH /api/anomalies/[id]
 * 異常レコードの解決
 * Body: { resolved: boolean }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { resolved } = body;

    if (typeof resolved !== "boolean") {
      return NextResponse.json(
        { error: "resolved must be a boolean" },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL) {
      const { getPrisma } = await import("@/lib/db");
      const record = await getPrisma().anomalyRecord.update({
        where: { id },
        data: { resolved },
      });
      return NextResponse.json(record);
    }

    return NextResponse.json({
      id,
      resolved,
      resolvedAt: resolved ? new Date().toISOString() : null,
    });
  } catch (error) {
    console.error("Failed to update anomaly:", error);
    return NextResponse.json(
      { error: "Failed to update anomaly record" },
      { status: 500 }
    );
  }
}
