/**
 * モックスクレイパー
 * 開発・テスト用。モックデータに±5%のランダム変動を加えた
 * 価格データを生成し、実スクレイパーと同じインターフェースで動作する。
 */
import type { PriceScraper, ScraperResult, RawPriceData } from "./types";
import { products } from "@/data/products";
import { priceEntries } from "@/data/prices";

const MOCK_SOURCES = [
  "kakaku.com",
  "amazon.co.jp",
  "tsukumo.co.jp",
  "dospara.co.jp",
];

/** 基準価格に±variation%のランダム変動を加える */
function randomize(base: number, variation = 0.05): number {
  const factor = 1 + (Math.random() * 2 - 1) * variation;
  return Math.round(base * factor);
}

export class MockScraper implements PriceScraper {
  readonly name = "mock";

  async getTargetProductIds(): Promise<string[]> {
    return products
      .filter((p) => p.status === "active")
      .map((p) => p.id);
  }

  async fetchPrices(productIds: string[]): Promise<ScraperResult> {
    const start = Date.now();
    const data: RawPriceData[] = [];
    const errors: string[] = [];

    for (const productId of productIds) {
      // モックデータから基準価格を取得
      const baseEntries = priceEntries.filter(
        (e) => e.productId === productId && !e.isQuarantined && e.sourceType === "official"
      );

      if (baseEntries.length === 0) continue;

      const basePrice = baseEntries[0].price;

      // 各ソースから価格を生成
      for (const source of MOCK_SOURCES) {
        data.push({
          productId,
          source,
          sourceType: "official",
          price: randomize(basePrice),
          shippingCost: Math.random() < 0.3 ? Math.round(Math.random() * 800) : 0,
          url: `https://${source}/item/${productId}`,
          fetchedAt: new Date().toISOString(),
        });
      }
    }

    return {
      source: this.name,
      success: true,
      data,
      errors,
      elapsed: Date.now() - start,
    };
  }
}
