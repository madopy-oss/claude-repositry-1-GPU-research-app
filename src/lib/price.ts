import type { PriceEntry, AggregatedPrice } from "@/types";

/**
 * 公式集計: 隔離されていないエントリのみで集計
 */
export function aggregatePrices(
  productId: string,
  entries: PriceEntry[]
): AggregatedPrice {
  const clean = entries.filter(
    (e) => e.productId === productId && !e.isQuarantined && e.sourceType === "official"
  );

  if (clean.length === 0) {
    return {
      productId,
      minPrice: 0,
      maxPrice: 0,
      avgPrice: 0,
      medianPrice: 0,
      entryCount: 0,
      lastUpdated: new Date().toISOString(),
      priceEntries: [],
    };
  }

  const prices = clean.map((e) => e.price + e.shippingCost);
  const sorted = [...prices].sort((a, b) => a - b);

  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 !== 0
      ? sorted[mid]
      : Math.round((sorted[mid - 1] + sorted[mid]) / 2);

  return {
    productId,
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    medianPrice: median,
    entryCount: clean.length,
    lastUpdated: clean.reduce(
      (latest, e) => (e.fetchedAt > latest ? e.fetchedAt : latest),
      clean[0].fetchedAt
    ),
    priceEntries: clean,
  };
}

/**
 * AI参考価格: sourceType === "ai_reference" のみ
 */
export function getAiReferencePrices(
  productId: string,
  entries: PriceEntry[]
): PriceEntry[] {
  return entries.filter(
    (e) => e.productId === productId && e.sourceType === "ai_reference"
  );
}
