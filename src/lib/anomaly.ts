import type { PriceEntry, AnomalyRecord, AnomalyType } from "@/types";

/**
 * 異常検知エンジン
 * 価格エントリを検査し、異常があれば隔離フラグを立てる
 */

interface AnomalyCheckResult {
  isAnomaly: boolean;
  type?: AnomalyType;
  severity?: "low" | "medium" | "high";
  message?: string;
  expectedRange?: { min: number; max: number };
}

/**
 * 桁ズレ検知: 他の価格と桁が異なる場合
 */
function checkDigitError(
  price: number,
  otherPrices: number[]
): AnomalyCheckResult {
  if (otherPrices.length < 2) return { isAnomaly: false };

  const median = getMedian(otherPrices);
  const digits = Math.floor(Math.log10(price));
  const medianDigits = Math.floor(Math.log10(median));

  if (Math.abs(digits - medianDigits) >= 2) {
    return {
      isAnomaly: true,
      type: "digit_error",
      severity: "high",
      message: `桁ズレ検知: ¥${price.toLocaleString()} (中央値: ¥${median.toLocaleString()})`,
      expectedRange: { min: median * 0.5, max: median * 1.5 },
    };
  }
  return { isAnomaly: false };
}

/**
 * 急騰検知: 直近平均から大幅に上昇
 */
function checkSuddenSpike(
  price: number,
  historicalPrices: number[]
): AnomalyCheckResult {
  if (historicalPrices.length < 3) return { isAnomaly: false };

  const avg = getAverage(historicalPrices);
  const threshold = 1.5; // 50%以上の急騰

  if (price > avg * threshold) {
    return {
      isAnomaly: true,
      type: "sudden_spike",
      severity: price > avg * 2 ? "high" : "medium",
      message: `急騰検知: ¥${price.toLocaleString()} (平均: ¥${Math.round(avg).toLocaleString()}, +${Math.round(((price - avg) / avg) * 100)}%)`,
      expectedRange: { min: avg * 0.8, max: avg * threshold },
    };
  }
  return { isAnomaly: false };
}

/**
 * 急落検知: 直近平均から大幅に下落
 */
function checkSuddenDrop(
  price: number,
  historicalPrices: number[]
): AnomalyCheckResult {
  if (historicalPrices.length < 3) return { isAnomaly: false };

  const avg = getAverage(historicalPrices);
  const threshold = 0.5; // 50%以上の急落

  if (price < avg * threshold) {
    return {
      isAnomaly: true,
      type: "sudden_drop",
      severity: price < avg * 0.3 ? "high" : "medium",
      message: `急落検知: ¥${price.toLocaleString()} (平均: ¥${Math.round(avg).toLocaleString()}, ${Math.round(((price - avg) / avg) * 100)}%)`,
      expectedRange: { min: avg * threshold, max: avg * 1.2 },
    };
  }
  return { isAnomaly: false };
}

/**
 * 送料異常検知: 送料が商品価格の一定割合を超える
 */
function checkShippingAnomaly(
  price: number,
  shippingCost: number
): AnomalyCheckResult {
  if (shippingCost <= 0) return { isAnomaly: false };

  const ratio = shippingCost / price;

  // 送料が商品価格の20%を超える or 送料が5000円を超える
  if (ratio > 0.2 || shippingCost > 5000) {
    return {
      isAnomaly: true,
      type: "shipping_anomaly",
      severity: ratio > 0.5 ? "high" : "medium",
      message: `送料異常: 送料¥${shippingCost.toLocaleString()} (商品価格の${Math.round(ratio * 100)}%)`,
      expectedRange: { min: 0, max: Math.min(price * 0.1, 2000) },
    };
  }
  return { isAnomaly: false };
}

/**
 * 外れ値検知: IQR法
 */
function checkOutlier(
  price: number,
  otherPrices: number[]
): AnomalyCheckResult {
  if (otherPrices.length < 4) return { isAnomaly: false };

  const sorted = [...otherPrices].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  if (price < lowerBound || price > upperBound) {
    return {
      isAnomaly: true,
      type: "outlier",
      severity: "low",
      message: `外れ値検知: ¥${price.toLocaleString()} (許容範囲: ¥${Math.round(lowerBound).toLocaleString()} 〜 ¥${Math.round(upperBound).toLocaleString()})`,
      expectedRange: { min: lowerBound, max: upperBound },
    };
  }
  return { isAnomaly: false };
}

/**
 * 全異常検知チェックを実行
 */
export function detectAnomalies(
  entry: PriceEntry,
  otherCurrentPrices: number[],
  historicalPrices: number[]
): AnomalyCheckResult[] {
  const results: AnomalyCheckResult[] = [];

  const checks = [
    checkDigitError(entry.price, otherCurrentPrices),
    checkSuddenSpike(entry.price, historicalPrices),
    checkSuddenDrop(entry.price, historicalPrices),
    checkShippingAnomaly(entry.price, entry.shippingCost),
    checkOutlier(entry.price, otherCurrentPrices),
  ];

  for (const check of checks) {
    if (check.isAnomaly) {
      results.push(check);
    }
  }

  return results;
}

/**
 * 価格エントリ配列から異常を検出し、隔離済みリストを返す
 */
export function processEntries(
  entries: PriceEntry[],
  historicalPrices: number[]
): { clean: PriceEntry[]; quarantined: PriceEntry[]; anomalies: AnomalyRecord[] } {
  const prices = entries.map((e) => e.price);
  const clean: PriceEntry[] = [];
  const quarantined: PriceEntry[] = [];
  const anomalies: AnomalyRecord[] = [];

  for (const entry of entries) {
    const otherPrices = prices.filter((p) => p !== entry.price);
    const results = detectAnomalies(entry, otherPrices, historicalPrices);

    if (results.length > 0) {
      const worst = results.reduce((a, b) =>
        severityOrder(b.severity!) > severityOrder(a.severity!) ? b : a
      );
      quarantined.push({
        ...entry,
        isQuarantined: true,
        quarantineReason: worst.type,
      });
      anomalies.push({
        id: `anomaly-${entry.id}`,
        priceEntryId: entry.id,
        productId: entry.productId,
        type: worst.type!,
        severity: worst.severity!,
        detectedAt: new Date().toISOString(),
        message: worst.message!,
        originalPrice: entry.price,
        expectedRange: worst.expectedRange!,
        resolved: false,
      });
    } else {
      clean.push(entry);
    }
  }

  return { clean, quarantined, anomalies };
}

// ===== ヘルパー =====

function getMedian(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function getAverage(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function severityOrder(s: "low" | "medium" | "high"): number {
  return { low: 1, medium: 2, high: 3 }[s];
}
