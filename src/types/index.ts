// ===== パーツカテゴリ =====
export type PartCategory = "cpu" | "gpu" | "memory" | "storage";
export type DeviceType = "desktop" | "laptop";
export type Tier = "S" | "A" | "B" | "C";

// ===== 製品マスタ =====
export type ProductStatus = "active" | "candidate" | "rejected" | "discontinued";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: PartCategory;
  deviceType: DeviceType;
  tier: Tier;
  status: ProductStatus;
  specs: Record<string, string>;
  imageUrl?: string;
  releaseDate: string;       // ISO date
  registeredAt: string;      // ISO date
  updatedAt: string;         // ISO date
}

// ===== 価格データ =====
export type PriceSourceType = "official" | "ai_reference";

export interface PriceEntry {
  id: string;
  productId: string;
  source: string;            // 例: "kakaku.com", "amazon.co.jp"
  sourceType: PriceSourceType;
  price: number;             // 税込み円
  shippingCost: number;      // 送料
  url: string;
  fetchedAt: string;         // ISO datetime
  isQuarantined: boolean;
  quarantineReason?: AnomalyType;
}

// ===== 集計済み価格 =====
export interface AggregatedPrice {
  productId: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  medianPrice: number;
  entryCount: number;
  lastUpdated: string;
  priceEntries: PriceEntry[];
}

// ===== 価格履歴 =====
export interface PriceHistoryPoint {
  date: string;              // ISO date
  minPrice: number;
  avgPrice: number;
  maxPrice: number;
}

export interface PriceHistory {
  productId: string;
  points: PriceHistoryPoint[];
}

// ===== 異常検知 =====
export type AnomalyType =
  | "digit_error"            // 桁ズレ
  | "sudden_spike"           // 急騰
  | "sudden_drop"            // 急落
  | "shipping_anomaly"       // 送料異常
  | "outlier";               // 外れ値

export interface AnomalyRecord {
  id: string;
  priceEntryId: string;
  productId: string;
  type: AnomalyType;
  severity: "low" | "medium" | "high";
  detectedAt: string;
  message: string;
  originalPrice: number;
  expectedRange: { min: number; max: number };
  resolved: boolean;
}

// ===== ダッシュボード集計 =====
export interface CategorySummary {
  category: PartCategory;
  totalProducts: number;
  activeProducts: number;
  avgPriceChange: number;    // パーセンテージ
  anomalyCount: number;
  lastUpdated: string;
}

// ===== 製品候補 =====
export interface ProductCandidate {
  id: string;
  name: string;
  brand: string;
  category: PartCategory;
  deviceType: DeviceType;
  suggestedTier: Tier;
  source: string;            // どこで発見されたか
  discoveredAt: string;
  status: "pending" | "approved" | "rejected";
  reviewNote?: string;
}
