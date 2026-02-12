/**
 * バッチ価格収集パイプライン
 *
 * フロー:
 *   1. Fetch   — スクレイパーで各ソースから価格取得
 *   2. Normalize — RawPriceData → PriceEntry に変換
 *   3. Detect  — 異常検知 → clean / quarantined に分離
 *   4. Store   — DB に保存（PriceEntry + AnomalyRecord）
 *   5. History — 日次集計ポイントを記録
 */
import { getScrapers } from "@/lib/scrapers";
import type { RawPriceData, ScraperResult } from "@/lib/scrapers";
import { processEntries } from "@/lib/anomaly";
import { aggregatePrices } from "@/lib/price";
import type { PriceEntry } from "@/types";

/** パイプライン各ステップの結果 */
interface StepResult {
  status: "success" | "skipped" | "error";
  message: string;
  count?: number;
}

/** パイプライン全体の結果 */
export interface PipelineResult {
  success: boolean;
  timestamp: string;
  elapsed: string;
  steps: {
    fetch: StepResult;
    normalize: StepResult;
    detect: StepResult;
    store: StepResult;
    history: StepResult;
  };
  summary: {
    totalFetched: number;
    cleanEntries: number;
    quarantinedEntries: number;
    anomaliesDetected: number;
    productsUpdated: number;
  };
}

let entryCounter = 0;
function generateEntryId(): string {
  return `pe-batch-${Date.now()}-${++entryCounter}`;
}

// ========== Step 1: Fetch ==========

async function stepFetch(): Promise<{ result: StepResult; data: RawPriceData[] }> {
  const scrapers = getScrapers();
  const allData: RawPriceData[] = [];
  const scraperResults: ScraperResult[] = [];

  for (const scraper of scrapers) {
    const productIds = await scraper.getTargetProductIds();
    if (productIds.length === 0) continue;
    const result = await scraper.fetchPrices(productIds);
    scraperResults.push(result);
    allData.push(...result.data);
  }

  const errors = scraperResults.flatMap((r) => r.errors);

  return {
    result: {
      status: allData.length > 0 ? "success" : "skipped",
      message: `${scraperResults.length}ソースから${allData.length}件取得${errors.length > 0 ? ` (警告${errors.length}件)` : ""}`,
      count: allData.length,
    },
    data: allData,
  };
}

// ========== Step 2: Normalize ==========

function stepNormalize(raw: RawPriceData[]): { result: StepResult; entries: PriceEntry[] } {
  const entries: PriceEntry[] = raw.map((r) => ({
    id: generateEntryId(),
    productId: r.productId,
    source: r.source,
    sourceType: r.sourceType,
    price: r.price,
    shippingCost: r.shippingCost,
    url: r.url,
    fetchedAt: r.fetchedAt,
    isQuarantined: false,
    quarantineReason: undefined,
  }));

  return {
    result: {
      status: "success",
      message: `${entries.length}件を正規化`,
      count: entries.length,
    },
    entries,
  };
}

// ========== Step 3: Detect ==========

function stepDetect(
  entries: PriceEntry[],
  existingPrices: number[]
): {
  result: StepResult;
  clean: PriceEntry[];
  quarantined: PriceEntry[];
  anomalyCount: number;
} {
  // 製品別に異常検知を実行
  const productIds = [...new Set(entries.map((e) => e.productId))];
  let totalClean: PriceEntry[] = [];
  let totalQuarantined: PriceEntry[] = [];
  let totalAnomalyCount = 0;

  for (const productId of productIds) {
    const productEntries = entries.filter((e) => e.productId === productId);
    // 既存の価格データ（過去履歴）を historicalPrices として渡す
    const { clean, quarantined, anomalies } = processEntries(productEntries, existingPrices);
    totalClean = [...totalClean, ...clean];
    totalQuarantined = [...totalQuarantined, ...quarantined];
    totalAnomalyCount += anomalies.length;
  }

  return {
    result: {
      status: "success",
      message: `正常${totalClean.length}件, 隔離${totalQuarantined.length}件, 異常${totalAnomalyCount}件`,
      count: totalClean.length,
    },
    clean: totalClean,
    quarantined: totalQuarantined,
    anomalyCount: totalAnomalyCount,
  };
}

// ========== Step 4: Store ==========

async function stepStore(
  clean: PriceEntry[],
  quarantined: PriceEntry[],
  useDb: boolean
): Promise<StepResult> {
  if (!useDb) {
    return {
      status: "skipped",
      message: "DATABASE_URL未設定のためDB保存スキップ",
      count: 0,
    };
  }

  try {
    const { getPrisma } = await import("@/lib/db");
    const prisma = getPrisma();
    const allEntries = [...clean, ...quarantined];

    // PriceEntry を一括保存
    await prisma.priceEntry.createMany({
      data: allEntries.map((e) => ({
        id: e.id,
        productId: e.productId,
        source: e.source,
        sourceType: e.sourceType,
        price: e.price,
        shippingCost: e.shippingCost,
        url: e.url,
        fetchedAt: new Date(e.fetchedAt),
        isQuarantined: e.isQuarantined,
        quarantineReason: e.quarantineReason ?? null,
      })),
    });

    return {
      status: "success",
      message: `${allEntries.length}件をDBに保存`,
      count: allEntries.length,
    };
  } catch (error) {
    return {
      status: "error",
      message: `DB保存エラー: ${error instanceof Error ? error.message : String(error)}`,
      count: 0,
    };
  }
}

// ========== Step 5: History ==========

async function stepHistory(
  clean: PriceEntry[],
  useDb: boolean
): Promise<{ result: StepResult; productsUpdated: number }> {
  if (!useDb) {
    // DB未接続時は集計だけ実行して結果を返す
    const productIds = [...new Set(clean.map((e) => e.productId))];
    return {
      result: {
        status: "skipped",
        message: `${productIds.length}製品の集計完了（DB未接続のため保存スキップ）`,
        count: productIds.length,
      },
      productsUpdated: productIds.length,
    };
  }

  try {
    const { getPrisma } = await import("@/lib/db");
    const prisma = getPrisma();
    const productIds = [...new Set(clean.map((e) => e.productId))];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let updated = 0;

    for (const productId of productIds) {
      const agg = aggregatePrices(productId, clean);
      if (agg.entryCount === 0) continue;

      await prisma.priceHistoryPoint.upsert({
        where: {
          productId_date: { productId, date: today },
        },
        update: {
          minPrice: agg.minPrice,
          avgPrice: agg.avgPrice,
          maxPrice: agg.maxPrice,
        },
        create: {
          productId,
          date: today,
          minPrice: agg.minPrice,
          avgPrice: agg.avgPrice,
          maxPrice: agg.maxPrice,
        },
      });
      updated++;
    }

    return {
      result: {
        status: "success",
        message: `${updated}製品の日次集計をDB保存`,
        count: updated,
      },
      productsUpdated: updated,
    };
  } catch (error) {
    return {
      result: {
        status: "error",
        message: `履歴保存エラー: ${error instanceof Error ? error.message : String(error)}`,
        count: 0,
      },
      productsUpdated: 0,
    };
  }
}

// ========== パイプライン実行 ==========

export async function runPipeline(): Promise<PipelineResult> {
  const startTime = Date.now();
  const useDb = !!process.env.DATABASE_URL;

  // Step 1: Fetch
  const fetchStep = await stepFetch();

  if (fetchStep.data.length === 0) {
    const elapsed = Date.now() - startTime;
    return {
      success: true,
      timestamp: new Date().toISOString(),
      elapsed: `${elapsed}ms`,
      steps: {
        fetch: fetchStep.result,
        normalize: { status: "skipped", message: "取得データなし" },
        detect: { status: "skipped", message: "取得データなし" },
        store: { status: "skipped", message: "取得データなし" },
        history: { status: "skipped", message: "取得データなし" },
      },
      summary: {
        totalFetched: 0,
        cleanEntries: 0,
        quarantinedEntries: 0,
        anomaliesDetected: 0,
        productsUpdated: 0,
      },
    };
  }

  // Step 2: Normalize
  const normalizeStep = stepNormalize(fetchStep.data);

  // Step 3: Detect
  // 既存の価格履歴がない場合は空配列（初回実行時は異常検知が緩くなる）
  const detectStep = stepDetect(normalizeStep.entries, []);

  // Step 4: Store
  const storeResult = await stepStore(detectStep.clean, detectStep.quarantined, useDb);

  // Step 5: History
  const historyStep = await stepHistory(detectStep.clean, useDb);

  const elapsed = Date.now() - startTime;

  return {
    success: storeResult.status !== "error" && historyStep.result.status !== "error",
    timestamp: new Date().toISOString(),
    elapsed: `${elapsed}ms`,
    steps: {
      fetch: fetchStep.result,
      normalize: normalizeStep.result,
      detect: detectStep.result,
      store: storeResult,
      history: historyStep.result,
    },
    summary: {
      totalFetched: fetchStep.data.length,
      cleanEntries: detectStep.clean.length,
      quarantinedEntries: detectStep.quarantined.length,
      anomaliesDetected: detectStep.anomalyCount,
      productsUpdated: historyStep.productsUpdated,
    },
  };
}
