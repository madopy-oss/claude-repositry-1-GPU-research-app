/**
 * 価格.com スクレイパー
 *
 * Phase 3+ で実装予定。
 * 実装時は cheerio でHTML解析、または価格.com API（あれば）を使用。
 *
 * 期待フロー:
 *   1. 製品URLリスト（DBのProduct.urlから取得 or IDマッピング）
 *   2. 各URLをfetchしてHTML取得
 *   3. 価格・送料・ショップ名をパース
 *   4. RawPriceData[] として返却
 */
import type { PriceScraper, ScraperResult } from "./types";

export class KakakuScraper implements PriceScraper {
  readonly name = "kakaku.com";

  async getTargetProductIds(): Promise<string[]> {
    // TODO: DBから kakaku.com の商品URLマッピングを取得
    return [];
  }

  async fetchPrices(productIds: string[]): Promise<ScraperResult> {
    const start = Date.now();

    // TODO: 実装
    // 1. 各productIdに対応する kakaku.com URL を取得
    // 2. fetch() で HTML を取得
    // 3. cheerio で価格テーブルをパース
    // 4. RawPriceData[] に変換

    return {
      source: this.name,
      success: true,
      data: [],
      errors: [`${this.name}: 未実装（Phase 3+ で実装予定）`],
      elapsed: Date.now() - start,
    };
  }
}
