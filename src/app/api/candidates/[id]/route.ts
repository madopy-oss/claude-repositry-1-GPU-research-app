import { NextRequest, NextResponse } from "next/server";

/**
 * PATCH /api/candidates/[id]
 * 候補の承認/却下
 * Body: { status: "approved" | "rejected", reviewNote?: string }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { status, reviewNote } = body;

    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "status must be 'approved' or 'rejected'" },
        { status: 400 }
      );
    }

    // DB接続がある場合はPrismaで更新
    if (process.env.DATABASE_URL) {
      const { getPrisma } = await import("@/lib/db");
      const candidate = await getPrisma().productCandidate.update({
        where: { id },
        data: {
          status,
          reviewNote: reviewNote || (status === "approved" ? "承認済み" : "却下"),
        },
      });
      return NextResponse.json(candidate);
    }

    // モックモード: ステータス変更のみレスポンス
    return NextResponse.json({
      id,
      status,
      reviewNote: reviewNote || (status === "approved" ? "承認済み" : "却下"),
      reviewedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to update candidate:", error);
    return NextResponse.json(
      { error: "Failed to update candidate" },
      { status: 500 }
    );
  }
}
