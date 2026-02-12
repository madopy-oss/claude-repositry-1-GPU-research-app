/**
 * Amazon.co.jp スクレイパー
 *
 * Phase 3+ で実装予定。
 * PA-API v5 または HTML パースで価格取得。
 * レートリミットとブロック対策が必要。
 */
import type { PriceScraper, ScraperResult } from "./types";

export class AmazonScraper implements PriceScraper {
  readonly name = "amazon.co.jp";

  async getTargetProductIds(): Promise<string[]> {
    return [];
  }

  async fetchPrices(productIds: string[]): Promise<ScraperResult> {
    const start = Date.now();

    return {
      source: this.name,
      success: true,
      data: [],
      errors: [`${this.name}: 未実装（Phase 3+ で実装予定）`],
      elapsed: Date.now() - start,
    };
  }
}
