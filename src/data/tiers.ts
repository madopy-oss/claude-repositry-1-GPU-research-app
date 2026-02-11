import type { PartCategory, Tier } from "@/types";

export interface TierDescription {
  tier: Tier;
  label: string;
  description: string;
}

export const tierDescriptions: Record<PartCategory, TierDescription[]> = {
  gpu: [
    { tier: "S", label: "フラグシップ", description: "4K 120fps+。最高画質で妥協なし。RTX 5090 / 5080 クラス" },
    { tier: "A", label: "ハイエンド", description: "WQHD 高画質〜4K 60fps。RTX 5070 Ti / RX 9070 XT クラス" },
    { tier: "B", label: "ミドルレンジ", description: "FHD 高画質〜WQHD 中設定。RTX 5070 / RX 9070 クラス" },
    { tier: "C", label: "エントリー", description: "FHD 中〜高設定。RX 7600 / Arc B580 クラス" },
  ],
  cpu: [
    { tier: "S", label: "最上位", description: "16C/24C 以上。マルチ性能最強。9950X / Core Ultra 285K クラス" },
    { tier: "A", label: "ハイエンド", description: "12C 級。ゲーミング＋配信/編集に最適。9900X / i9-14900K クラス" },
    { tier: "B", label: "ミドルレンジ", description: "6〜8C。ゲーム中心なら十分な性能。9700X / 9600X クラス" },
    { tier: "C", label: "エントリー", description: "コスパ重視。ライトゲーミング向け。i5-14600K クラス" },
  ],
  memory: [
    { tier: "S", label: "ハイエンド", description: "DDR5-7200+ / 32GB以上。OC向きの低レイテンシ" },
    { tier: "A", label: "高速", description: "DDR5-6000 / 32GB。AM5 スイートスポット" },
    { tier: "B", label: "標準", description: "DDR5-5600 / 32GB。安定動作を重視" },
    { tier: "C", label: "最低限", description: "DDR5-4800 / 16GB。予算優先の最小構成" },
  ],
  storage: [
    { tier: "S", label: "最速", description: "PCIe 5.0 or PCIe 4.0 2TB。読み書き 7000MB/s+" },
    { tier: "A", label: "高速", description: "PCIe 4.0 高速モデル 2TB。実用最速クラス" },
    { tier: "B", label: "標準", description: "PCIe 4.0 1TB。ゲーム用途に十分な速度" },
    { tier: "C", label: "エントリー", description: "SATA SSD。OS / 倉庫ドライブ向き" },
  ],
};
