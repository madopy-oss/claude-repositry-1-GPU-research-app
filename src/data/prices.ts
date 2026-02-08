import type { PriceEntry, PriceHistory, AnomalyRecord } from "@/types";

// ===== 現在の価格データ =====
export const priceEntries: PriceEntry[] = [
  // GPU - RTX 5090
  { id: "pe-1", productId: "gpu-rtx5090", source: "kakaku.com", sourceType: "official", price: 398000, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-2", productId: "gpu-rtx5090", source: "amazon.co.jp", sourceType: "official", price: 410000, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:05:00Z", isQuarantined: false },
  { id: "pe-3", productId: "gpu-rtx5090", source: "tsukumo.co.jp", sourceType: "official", price: 405000, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:10:00Z", isQuarantined: false },
  { id: "pe-q1", productId: "gpu-rtx5090", source: "unknown-shop", sourceType: "official", price: 39800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:15:00Z", isQuarantined: true, quarantineReason: "digit_error" },

  // GPU - RTX 5080
  { id: "pe-4", productId: "gpu-rtx5080", source: "kakaku.com", sourceType: "official", price: 229800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-5", productId: "gpu-rtx5080", source: "amazon.co.jp", sourceType: "official", price: 235000, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:05:00Z", isQuarantined: false },
  { id: "pe-6", productId: "gpu-rtx5080", source: "dospara.co.jp", sourceType: "official", price: 232000, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:10:00Z", isQuarantined: false },

  // GPU - RTX 5070 Ti
  { id: "pe-7", productId: "gpu-rtx5070ti", source: "kakaku.com", sourceType: "official", price: 169800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-8", productId: "gpu-rtx5070ti", source: "amazon.co.jp", sourceType: "official", price: 175000, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:05:00Z", isQuarantined: false },

  // GPU - RTX 5070
  { id: "pe-9", productId: "gpu-rtx5070", source: "kakaku.com", sourceType: "official", price: 119800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-10", productId: "gpu-rtx5070", source: "amazon.co.jp", sourceType: "official", price: 124800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:05:00Z", isQuarantined: false },
  { id: "pe-11", productId: "gpu-rtx5070", source: "tsukumo.co.jp", sourceType: "official", price: 121000, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:10:00Z", isQuarantined: false },

  // GPU - RTX 4070 SUPER
  { id: "pe-12", productId: "gpu-rtx4070s", source: "kakaku.com", sourceType: "official", price: 89800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-13", productId: "gpu-rtx4070s", source: "amazon.co.jp", sourceType: "official", price: 92800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:05:00Z", isQuarantined: false },

  // GPU - RX 9070 XT
  { id: "pe-14", productId: "gpu-rx9070xt", source: "kakaku.com", sourceType: "official", price: 109800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-15", productId: "gpu-rx9070xt", source: "amazon.co.jp", sourceType: "official", price: 112000, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:05:00Z", isQuarantined: false },

  // GPU - RX 9070
  { id: "pe-16", productId: "gpu-rx9070", source: "kakaku.com", sourceType: "official", price: 82800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-17", productId: "gpu-rx9070", source: "amazon.co.jp", sourceType: "official", price: 85000, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:05:00Z", isQuarantined: false },

  // GPU - RX 7600
  { id: "pe-18", productId: "gpu-rx7600", source: "kakaku.com", sourceType: "official", price: 37800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-19", productId: "gpu-rx7600", source: "amazon.co.jp", sourceType: "official", price: 39800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:05:00Z", isQuarantined: false },

  // GPU - Arc B580
  { id: "pe-20", productId: "gpu-b580", source: "kakaku.com", sourceType: "official", price: 42800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-21", productId: "gpu-b580", source: "amazon.co.jp", sourceType: "official", price: 44800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:05:00Z", isQuarantined: false },

  // GPU - Laptop
  { id: "pe-22", productId: "gpu-rtx5090m", source: "kakaku.com", sourceType: "official", price: 550000, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-23", productId: "gpu-rtx5080m", source: "kakaku.com", sourceType: "official", price: 380000, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },

  // CPU - Desktop
  { id: "pe-30", productId: "cpu-9950x", source: "kakaku.com", sourceType: "official", price: 98800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-31", productId: "cpu-9950x", source: "amazon.co.jp", sourceType: "official", price: 101800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:05:00Z", isQuarantined: false },
  { id: "pe-32", productId: "cpu-9900x", source: "kakaku.com", sourceType: "official", price: 72800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-33", productId: "cpu-9900x", source: "amazon.co.jp", sourceType: "official", price: 74800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:05:00Z", isQuarantined: false },
  { id: "pe-34", productId: "cpu-9700x", source: "kakaku.com", sourceType: "official", price: 52800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-35", productId: "cpu-9600x", source: "kakaku.com", sourceType: "official", price: 42800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-36", productId: "cpu-14900k", source: "kakaku.com", sourceType: "official", price: 78800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-37", productId: "cpu-285k", source: "kakaku.com", sourceType: "official", price: 96800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-38", productId: "cpu-14600k", source: "kakaku.com", sourceType: "official", price: 38800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },

  // CPU - Laptop
  { id: "pe-39", productId: "cpu-9955hx", source: "kakaku.com", sourceType: "official", price: 280000, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-40", productId: "cpu-ultra9-288v", source: "kakaku.com", sourceType: "official", price: 220000, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },

  // Memory
  { id: "pe-50", productId: "mem-ddr5-7200-32", source: "kakaku.com", sourceType: "official", price: 28800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-51", productId: "mem-ddr5-6000-32", source: "kakaku.com", sourceType: "official", price: 18800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-52", productId: "mem-ddr5-5600-32", source: "kakaku.com", sourceType: "official", price: 13800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-53", productId: "mem-ddr5-4800-16", source: "kakaku.com", sourceType: "official", price: 7800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-54", productId: "mem-lp-ddr5-5600-32", source: "kakaku.com", sourceType: "official", price: 15800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },

  // Storage
  { id: "pe-60", productId: "ssd-990pro-2tb", source: "kakaku.com", sourceType: "official", price: 22800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-61", productId: "ssd-t705-2tb", source: "kakaku.com", sourceType: "official", price: 42800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-62", productId: "ssd-sn850x-2tb", source: "kakaku.com", sourceType: "official", price: 21800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-63", productId: "ssd-p44pro-1tb", source: "kakaku.com", sourceType: "official", price: 13800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-64", productId: "ssd-870evo-1tb", source: "kakaku.com", sourceType: "official", price: 11800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },
  { id: "pe-65", productId: "ssd-lp-990pro-1tb", source: "kakaku.com", sourceType: "official", price: 16800, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:00:00Z", isQuarantined: false },

  // AI参考データ
  { id: "pe-ai-1", productId: "gpu-rtx5090", source: "AI抽出 (PC Watch)", sourceType: "ai_reference", price: 395000, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T12:00:00Z", isQuarantined: false },

  // 異常データ: 送料異常
  { id: "pe-q2", productId: "gpu-rtx5080", source: "suspicious-shop", sourceType: "official", price: 198000, shippingCost: 50000, url: "#", fetchedAt: "2026-02-07T10:20:00Z", isQuarantined: true, quarantineReason: "shipping_anomaly" },

  // 異常データ: 急騰
  { id: "pe-q3", productId: "gpu-rtx5070", source: "reseller", sourceType: "official", price: 250000, shippingCost: 0, url: "#", fetchedAt: "2026-02-07T10:25:00Z", isQuarantined: true, quarantineReason: "sudden_spike" },
];

// ===== 価格履歴データ（30日分） =====
function generateHistory(productId: string, basePrice: number, volatility: number = 0.05): PriceHistory {
  const points: PriceHistory["points"] = [];
  const now = new Date("2026-02-07");

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const factor = 1 + (Math.sin(i * 0.3) * volatility) + ((30 - i) * -0.001);
    const avg = Math.round(basePrice * factor);
    points.push({
      date: date.toISOString().split("T")[0],
      minPrice: Math.round(avg * 0.97),
      avgPrice: avg,
      maxPrice: Math.round(avg * 1.04),
    });
  }
  return { productId, points };
}

export const priceHistories: PriceHistory[] = [
  generateHistory("gpu-rtx5090", 400000, 0.03),
  generateHistory("gpu-rtx5080", 232000, 0.04),
  generateHistory("gpu-rtx5070ti", 172000, 0.03),
  generateHistory("gpu-rtx5070", 122000, 0.05),
  generateHistory("gpu-rtx4070s", 91000, 0.06),
  generateHistory("gpu-rx9070xt", 110000, 0.04),
  generateHistory("gpu-rx9070", 84000, 0.05),
  generateHistory("gpu-rx7600", 38800, 0.08),
  generateHistory("gpu-b580", 43800, 0.06),
  generateHistory("cpu-9950x", 100000, 0.04),
  generateHistory("cpu-9900x", 73800, 0.05),
  generateHistory("cpu-9700x", 52800, 0.04),
  generateHistory("cpu-285k", 96800, 0.03),
  generateHistory("ssd-990pro-2tb", 22800, 0.06),
  generateHistory("ssd-t705-2tb", 42800, 0.04),
  generateHistory("mem-ddr5-7200-32", 28800, 0.05),
  generateHistory("mem-ddr5-6000-32", 18800, 0.07),
];

// ===== 隔離済み異常レコード =====
export const anomalyRecords: AnomalyRecord[] = [
  {
    id: "ar-1",
    priceEntryId: "pe-q1",
    productId: "gpu-rtx5090",
    type: "digit_error",
    severity: "high",
    detectedAt: "2026-02-07T10:15:00Z",
    message: "桁ズレ検知: ¥39,800 (中央値: ¥405,000)",
    originalPrice: 39800,
    expectedRange: { min: 202500, max: 607500 },
    resolved: false,
  },
  {
    id: "ar-2",
    priceEntryId: "pe-q2",
    productId: "gpu-rtx5080",
    type: "shipping_anomaly",
    severity: "high",
    detectedAt: "2026-02-07T10:20:00Z",
    message: "送料異常: 送料¥50,000 (商品価格の25%)",
    originalPrice: 198000,
    expectedRange: { min: 0, max: 19800 },
    resolved: false,
  },
  {
    id: "ar-3",
    priceEntryId: "pe-q3",
    productId: "gpu-rtx5070",
    type: "sudden_spike",
    severity: "medium",
    detectedAt: "2026-02-07T10:25:00Z",
    message: "急騰検知: ¥250,000 (平均: ¥121,867, +105%)",
    originalPrice: 250000,
    expectedRange: { min: 97494, max: 182800 },
    resolved: false,
  },
];
