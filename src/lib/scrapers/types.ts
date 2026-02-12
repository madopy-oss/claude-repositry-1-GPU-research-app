/**
 * スクレイパー共通型定義
 */

/** スクレイパーが取得する生の価格データ */
export interface RawPriceData {
  productId: string;
  source: string;
  sourceType: "official" | "ai_reference";
  price: number;
  shippingCost: number;
  url: string;
  fetchedAt: string; // ISO string
}

/** スクレイパー実行結果 */
export interface ScraperResult {
  source: string;
  success: boolean;
  data: RawPriceData[];
  errors: string[];
  elapsed: number; // ms
}

/** スクレイパーインターフェース */
export interface PriceScraper {
  /** ソース名（例: "kakaku.com"） */
  readonly name: string;
  /** このスクレイパーが対応する製品IDリスト取得 */
  getTargetProductIds(): Promise<string[]>;
  /** 指定製品の価格を取得 */
  fetchPrices(productIds: string[]): Promise<ScraperResult>;
}
