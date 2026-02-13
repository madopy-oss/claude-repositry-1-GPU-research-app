/**
 * サーバーサイド データ取得層
 * Server Components から直接呼び出す
 */
import { getPrisma } from "@/lib/db";
import type {
  PartCategory,
  DeviceType,
  Product,
  PriceEntry,
  AggregatedPrice,
  PriceHistory,
  AnomalyRecord,
  ProductCandidate,
} from "@/types";

// ===== 製品 =====

export async function getProducts(filters?: {
  category?: PartCategory;
  deviceType?: DeviceType;
  status?: string;
}): Promise<Product[]> {
  const where: Record<string, unknown> = {};
  if (filters?.category) where.category = filters.category;
  if (filters?.deviceType) where.deviceType = filters.deviceType;
  if (filters?.status) where.status = filters.status;

  const rows = await getPrisma().product.findMany({ where, orderBy: { name: "asc" } });
  return rows.map(toProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const row = await getPrisma().product.findUnique({ where: { id } });
  return row ? toProduct(row) : null;
}

// ===== 価格エントリ =====

export async function getPriceEntries(productId: string): Promise<PriceEntry[]> {
  const rows = await getPrisma().priceEntry.findMany({
    where: { productId },
    orderBy: { fetchedAt: "desc" },
  });
  return rows.map(toPriceEntry);
}

export async function getAllPriceEntries(): Promise<PriceEntry[]> {
  const rows = await getPrisma().priceEntry.findMany({
    orderBy: { fetchedAt: "desc" },
  });
  return rows.map(toPriceEntry);
}

// ===== 集計済み価格 =====

export async function getAggregatedPrice(productId: string): Promise<AggregatedPrice> {
  const entries = await getPrisma().priceEntry.findMany({
    where: {
      productId,
      isQuarantined: false,
      sourceType: "official",
    },
    orderBy: { fetchedAt: "desc" },
  });

  if (entries.length === 0) {
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

  const prices = entries.map((e) => e.price + e.shippingCost);
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
    entryCount: entries.length,
    lastUpdated: entries[0].fetchedAt.toISOString(),
    priceEntries: entries.map(toPriceEntry),
  };
}

// ===== 価格履歴 =====

export async function getPriceHistory(productId: string): Promise<PriceHistory | null> {
  const points = await getPrisma().priceHistoryPoint.findMany({
    where: { productId },
    orderBy: { date: "asc" },
  });

  if (points.length === 0) return null;

  return {
    productId,
    points: points.map((p) => ({
      date: p.date.toISOString().split("T")[0],
      minPrice: p.minPrice,
      avgPrice: p.avgPrice,
      maxPrice: p.maxPrice,
    })),
  };
}

export async function getAllPriceHistories(): Promise<PriceHistory[]> {
  const points = await getPrisma().priceHistoryPoint.findMany({
    orderBy: { date: "asc" },
  });

  const grouped = new Map<string, PriceHistory>();
  for (const p of points) {
    if (!grouped.has(p.productId)) {
      grouped.set(p.productId, { productId: p.productId, points: [] });
    }
    grouped.get(p.productId)!.points.push({
      date: p.date.toISOString().split("T")[0],
      minPrice: p.minPrice,
      avgPrice: p.avgPrice,
      maxPrice: p.maxPrice,
    });
  }

  return Array.from(grouped.values());
}

// ===== 異常検知 =====

export async function getAnomalyRecords(filters?: {
  resolved?: boolean;
}): Promise<AnomalyRecord[]> {
  const where: Record<string, unknown> = {};
  if (filters?.resolved !== undefined) where.resolved = filters.resolved;

  const rows = await getPrisma().anomalyRecord.findMany({
    where,
    orderBy: { detectedAt: "desc" },
  });
  return rows.map(toAnomalyRecord);
}

// ===== 製品候補 =====

export async function getProductCandidates(status?: string): Promise<ProductCandidate[]> {
  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const rows = await getPrisma().productCandidate.findMany({
    where,
    orderBy: { discoveredAt: "desc" },
  });
  return rows.map(toProductCandidate);
}

// ===== ダッシュボード集計 =====

export async function getLastFetchedAt(): Promise<string | null> {
  const latest = await getPrisma().priceEntry.findFirst({
    orderBy: { fetchedAt: "desc" },
    select: { fetchedAt: true },
  });
  return latest ? latest.fetchedAt.toISOString() : null;
}

export async function getDashboardData() {
  const [products, priceEntries, anomalyRecords, priceHistories, lastFetchedAt] = await Promise.all([
    getProducts({ status: "active" }),
    getAllPriceEntries(),
    getAnomalyRecords({ resolved: false }),
    getAllPriceHistories(),
    getLastFetchedAt(),
  ]);

  return { products, priceEntries, anomalyRecords, priceHistories, lastFetchedAt };
}

// ===== カテゴリページ用 =====

export async function getCategoryPageData(category: PartCategory) {
  const [products, priceEntries, priceHistories] = await Promise.all([
    getProducts({ category, status: "active" }),
    getAllPriceEntries(),
    getAllPriceHistories(),
  ]);

  return { products, priceEntries, priceHistories };
}

// ===== 型変換ヘルパー =====

function toProduct(row: {
  id: string;
  name: string;
  brand: string;
  category: string;
  deviceType: string;
  tier: string;
  status: string;
  specs: unknown;
  imageUrl: string | null;
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}): Product {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category as PartCategory,
    deviceType: row.deviceType as DeviceType,
    tier: row.tier as Product["tier"],
    status: row.status as Product["status"],
    specs: row.specs as Record<string, string>,
    imageUrl: row.imageUrl ?? undefined,
    releaseDate: row.releaseDate.toISOString().split("T")[0],
    registeredAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function toPriceEntry(row: {
  id: string;
  productId: string;
  source: string;
  sourceType: string;
  price: number;
  shippingCost: number;
  url: string;
  fetchedAt: Date;
  isQuarantined: boolean;
  quarantineReason: string | null;
}): PriceEntry {
  return {
    id: row.id,
    productId: row.productId,
    source: row.source,
    sourceType: row.sourceType as PriceEntry["sourceType"],
    price: row.price,
    shippingCost: row.shippingCost,
    url: row.url,
    fetchedAt: row.fetchedAt.toISOString(),
    isQuarantined: row.isQuarantined,
    quarantineReason: row.quarantineReason as PriceEntry["quarantineReason"],
  };
}

function toAnomalyRecord(row: {
  id: string;
  priceEntryId: string;
  productId: string;
  type: string;
  severity: string;
  detectedAt: Date;
  message: string;
  originalPrice: number;
  expectedRange: unknown;
  resolved: boolean;
}): AnomalyRecord {
  return {
    id: row.id,
    priceEntryId: row.priceEntryId,
    productId: row.productId,
    type: row.type as AnomalyRecord["type"],
    severity: row.severity as AnomalyRecord["severity"],
    detectedAt: row.detectedAt.toISOString(),
    message: row.message,
    originalPrice: row.originalPrice,
    expectedRange: row.expectedRange as { min: number; max: number },
    resolved: row.resolved,
  };
}

function toProductCandidate(row: {
  id: string;
  name: string;
  brand: string;
  category: string;
  deviceType: string;
  suggestedTier: string;
  source: string;
  discoveredAt: Date;
  status: string;
  reviewNote: string | null;
}): ProductCandidate {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category as PartCategory,
    deviceType: row.deviceType as DeviceType,
    suggestedTier: row.suggestedTier as ProductCandidate["suggestedTier"],
    source: row.source,
    discoveredAt: row.discoveredAt.toISOString().split("T")[0],
    status: row.status as ProductCandidate["status"],
    reviewNote: row.reviewNote ?? undefined,
  };
}
