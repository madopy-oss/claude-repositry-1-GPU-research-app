import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/batch/collect
 * バッチ価格収集パイプラインのスケルトン
 *
 * Phase 3 で実データソース接続を実装予定。
 * 現在は GitHub Actions cron から呼び出され、
 * パイプラインの基盤構造のみ提供。
 *
 * 認証: BATCH_API_SECRET ヘッダーで保護
 */
export async function POST(request: NextRequest) {
  // API キー認証
  const apiSecret = request.headers.get("x-api-secret");
  const expectedSecret = process.env.BATCH_API_SECRET;

  if (!expectedSecret || apiSecret !== expectedSecret) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const startTime = Date.now();

    // Phase 3 で実装予定のパイプライン:
    // 1. Fetch: 価格比較サイトからデータ取得
    // 2. Normalize: 価格データの正規化
    // 3. Anomaly Detection: 異常検知 → 隔離
    // 4. Aggregate: 公式集計の更新
    // 5. History: 価格履歴ポイントの記録

    const pipeline = {
      fetch: { status: "skipped", message: "Phase 3で実装予定" },
      normalize: { status: "skipped", message: "Phase 3で実装予定" },
      anomalyDetection: { status: "skipped", message: "Phase 3で実装予定" },
      aggregate: { status: "skipped", message: "Phase 3で実装予定" },
      history: { status: "skipped", message: "Phase 3で実装予定" },
    };

    const elapsed = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      elapsed: `${elapsed}ms`,
      pipeline,
      message: "Batch pipeline skeleton executed. Phase 3 will add real data sources.",
    });
  } catch (error) {
    console.error("Batch pipeline error:", error);
    return NextResponse.json(
      { error: "Batch pipeline failed" },
      { status: 500 }
    );
  }
}
