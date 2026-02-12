import { NextRequest, NextResponse } from "next/server";
import { runPipeline } from "@/lib/batch/pipeline";

/**
 * POST /api/batch
 * バッチ価格収集パイプライン
 *
 * GitHub Actions cron または手動で呼び出される。
 * 認証: x-api-secret ヘッダー = BATCH_API_SECRET 環境変数
 *
 * フロー: Fetch → Normalize → Detect → Store → History
 */
export async function POST(request: NextRequest) {
  const apiSecret = request.headers.get("x-api-secret");
  const expectedSecret = process.env.BATCH_API_SECRET;

  if (!expectedSecret || apiSecret !== expectedSecret) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const result = await runPipeline();

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    console.error("Batch pipeline error:", error);
    return NextResponse.json(
      { error: "Batch pipeline failed", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
