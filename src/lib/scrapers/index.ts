/**
 * スクレイパーレジストリ
 *
 * 環境変数 SCRAPER_MODE で切替:
 *   "mock"  → モックスクレイパー（デフォルト、開発用）
 *   "live"  → 実スクレイパー群（Phase 3+ で有効化）
 */
import type { PriceScraper } from "./types";
import { MockScraper } from "./mock";
import { KakakuScraper } from "./kakaku";
import { AmazonScraper } from "./amazon";

export type { PriceScraper, ScraperResult, RawPriceData } from "./types";

/** 有効なスクレイパー一覧を取得 */
export function getScrapers(): PriceScraper[] {
  const mode = process.env.SCRAPER_MODE || "mock";

  if (mode === "live") {
    return [
      new KakakuScraper(),
      new AmazonScraper(),
      // 今後追加: TsukumoScraper, DosparaScraper, etc.
    ];
  }

  // デフォルト: モックスクレイパー
  return [new MockScraper()];
}
