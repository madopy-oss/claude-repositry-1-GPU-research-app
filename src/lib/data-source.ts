/**
 * データソース抽象化レイヤー
 *
 * DATABASE_URL が設定されていれば DB から取得、
 * なければモックデータにフォールバック。
 * これにより Neon 未接続でも動作する。
 */
import type {
  PartCategory,
  Product,
  PriceEntry,
  AggregatedPrice,
  PriceHistory,
  AnomalyRecord,
  ProductCandidate,
} from "@/types";

// モックデータ (フォールバック用)
import { products as mockProducts } from "@/data/products";
import { priceEntries as mockPriceEntries, priceHistories as mockPriceHistories, anomalyRecords as mockAnomalyRecords } from "@/data/prices";
import { productCandidates as mockCandidates } from "@/data/candidates";
import { aggregatePrices } from "@/lib/price";

const useDb = !!process.env.DATABASE_URL;

// DB取得関数を遅延ロード (DATABASE_URLがない場合にPrisma接続エラーを防ぐ)
async function getQueries() {
  return await import("@/lib/queries");
}

// ===== ダッシュボード =====
export async function fetchDashboardData(): Promise<{
  products: Product[];
  priceEntries: PriceEntry[];
  anomalyRecords: AnomalyRecord[];
  priceHistories: PriceHistory[];
  lastFetchedAt: string | null;
}> {
  if (useDb) {
    const q = await getQueries();
    return q.getDashboardData();
  }
  return {
    products: mockProducts,
    priceEntries: mockPriceEntries,
    anomalyRecords: mockAnomalyRecords,
    priceHistories: mockPriceHistories,
    lastFetchedAt: null,
  };
}

// ===== カテゴリページ =====
export async function fetchCategoryData(category: PartCategory): Promise<{
  products: Product[];
  priceEntries: PriceEntry[];
  priceHistories: PriceHistory[];
}> {
  if (useDb) {
    const q = await getQueries();
    return q.getCategoryPageData(category);
  }
  return {
    products: mockProducts.filter((p) => p.category === category),
    priceEntries: mockPriceEntries,
    priceHistories: mockPriceHistories,
  };
}

// ===== 異常検知ページ =====
export async function fetchQuarantineData(): Promise<{
  products: Product[];
  priceEntries: PriceEntry[];
  anomalyRecords: AnomalyRecord[];
}> {
  if (useDb) {
    const q = await getQueries();
    const [products, priceEntries, anomalyRecords] = await Promise.all([
      q.getProducts({ status: "active" }),
      q.getAllPriceEntries(),
      q.getAnomalyRecords(),
    ]);
    return { products, priceEntries, anomalyRecords };
  }
  return {
    products: mockProducts,
    priceEntries: mockPriceEntries,
    anomalyRecords: mockAnomalyRecords,
  };
}

// ===== 製品管理ページ =====
export async function fetchProductManagementData(): Promise<{
  products: Product[];
  candidates: ProductCandidate[];
}> {
  if (useDb) {
    const q = await getQueries();
    const [products, candidates] = await Promise.all([
      q.getProducts({ status: "active" }),
      q.getProductCandidates(),
    ]);
    return { products, candidates };
  }
  return {
    products: mockProducts.filter((p) => p.status === "active"),
    candidates: mockCandidates,
  };
}

// ===== 集計ヘルパー =====
export async function fetchAggregatedPrice(
  productId: string,
  allEntries?: PriceEntry[]
): Promise<AggregatedPrice> {
  if (useDb) {
    const q = await getQueries();
    return q.getAggregatedPrice(productId);
  }
  return aggregatePrices(productId, allEntries ?? mockPriceEntries);
}
