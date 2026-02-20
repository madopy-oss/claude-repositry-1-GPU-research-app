"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TierBadge } from "@/components/ui/tier-badge";
import { Tabs } from "@/components/ui/tabs";
import { PriceChart } from "@/components/charts/price-chart";
import { aggregatePrices } from "@/lib/price";
import { formatPrice, formatDate, tierBorderColor, cn } from "@/lib/utils";
import type { PartCategory, Tier, DeviceType, Product, PriceEntry, AggregatedPrice, PriceHistory } from "@/types";
import { ChevronDown, ChevronUp, ExternalLink, Info, TrendingDown, TrendingUp, Package, DollarSign } from "lucide-react";
import { tierDescriptions } from "@/data/tiers";

interface ProductWithPricing extends Product {
  agg: AggregatedPrice;
  history?: PriceHistory;
}

interface ProductListProps {
  category: PartCategory;
  title: string;
  description: string;
  products: Product[];
  priceEntries: PriceEntry[];
  priceHistories: PriceHistory[];
}

const tierOrder: Record<Tier, number> = { S: 0, A: 1, B: 2, C: 3 };

const deviceTabs = [
  { id: "desktop", label: "Desktop" },
  { id: "laptop", label: "Laptop" },
];

export function ProductList({ category, title, description, products, priceEntries, priceHistories }: ProductListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"tier" | "price">("tier");
  const [showTierGuide, setShowTierGuide] = useState(true);
  const tiers = tierDescriptions[category];

  const getProducts = (deviceType: DeviceType): ProductWithPricing[] => {
    return products
      .filter((p) => p.category === category && p.deviceType === deviceType && p.status === "active")
      .map((p) => ({
        ...p,
        agg: aggregatePrices(p.id, priceEntries),
        history: priceHistories.find((h) => h.productId === p.id),
      }))
      .sort((a, b) => {
        if (sortBy === "tier") {
          const td = tierOrder[a.tier] - tierOrder[b.tier];
          if (td !== 0) return td;
          return a.agg.minPrice - b.agg.minPrice;
        }
        return a.agg.minPrice - b.agg.minPrice;
      });
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy("tier")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              sortBy === "tier"
                ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
            )}
          >
            Tier順
          </button>
          <button
            onClick={() => setSortBy("price")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              sortBy === "price"
                ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
            )}
          >
            価格順
          </button>
        </div>
      </div>

      {/* Tier ガイド */}
      <Card>
        <button
          onClick={() => setShowTierGuide(!showTierGuide)}
          className="flex w-full items-center gap-2 px-5 py-3 text-left"
        >
          <Info size={16} className="shrink-0 text-violet-500" />
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            Tier ガイド
          </span>
          <span className="text-xs text-slate-400">— {title}のスペック目安</span>
          <ChevronDown
            size={14}
            className={cn(
              "ml-auto shrink-0 text-slate-400 transition-transform",
              showTierGuide && "rotate-180"
            )}
          />
        </button>
        {showTierGuide && (
          <CardContent className="border-t border-slate-100 pt-3 dark:border-slate-800">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {tiers.map((t) => (
                <div
                  key={t.tier}
                  className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
                >
                  <div className="mb-1.5 flex items-center gap-2">
                    <TierBadge tier={t.tier} size="sm" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {t.label}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    {t.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* カテゴリ統計サマリー */}
      {(() => {
        const desktopItems = getProducts("desktop");
        const allPrices = desktopItems.filter((p) => p.agg.minPrice > 0);
        const cheapest = allPrices.length > 0 ? allPrices.reduce((a, b) => a.agg.minPrice < b.agg.minPrice ? a : b) : null;
        const avgMin = allPrices.length > 0 ? Math.round(allPrices.reduce((s, p) => s + p.agg.minPrice, 0) / allPrices.length) : 0;
        return (
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                  <Package size={18} />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{desktopItems.length}</p>
                  <p className="text-[10px] text-slate-500">監視中の製品</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <TrendingDown size={18} />
                </div>
                <div>
                  <p className="text-xl font-bold text-violet-600 dark:text-violet-400">{cheapest ? formatPrice(cheapest.agg.minPrice) : "—"}</p>
                  <p className="text-[10px] text-slate-500">{cheapest ? cheapest.name : "カテゴリ最安値"}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                  <DollarSign size={18} />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{avgMin > 0 ? formatPrice(avgMin) : "—"}</p>
                  <p className="text-[10px] text-slate-500">平均最安値</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })()}

      {/* Desktop / Laptop タブ */}
      <Tabs tabs={deviceTabs} defaultTab="desktop">
        {(activeTab) => {
          const items = getProducts(activeTab as DeviceType);

          if (items.length === 0) {
            return (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-sm text-slate-500">
                    {activeTab === "laptop" ? "ノートPC" : "デスクトップ"}向けの製品はまだ登録されていません
                  </p>
                </CardContent>
              </Card>
            );
          }

          return (
            <div className="space-y-3">
              {items.map((p) => {
                const isExpanded = expandedId === p.id;
                // 価格変動率
                const pts = p.history?.points ?? [];
                let changePercent: number | null = null;
                if (pts.length >= 2) {
                  const latest = pts[pts.length - 1].minPrice;
                  const prev = pts[pts.length - 2].minPrice;
                  if (prev > 0) changePercent = Math.round(((latest - prev) / prev) * 1000) / 10;
                }

                return (
                  <Card
                    key={p.id}
                    className={cn(
                      "overflow-hidden border-l-4 transition-all",
                      tierBorderColor(p.tier)
                    )}
                  >
                    {/* メインカード（常に表示） */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : p.id)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left sm:gap-4 sm:px-5 sm:py-4"
                    >
                      <TierBadge tier={p.tier} size="lg" />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
                            {p.name}
                          </h3>
                          {changePercent !== null && changePercent !== 0 && (
                            <span className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                              changePercent < 0
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                            }`}>
                              {changePercent < 0 ? <TrendingDown size={9} /> : <TrendingUp size={9} />}
                              {changePercent > 0 ? "+" : ""}{changePercent}%
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{p.brand}</p>
                      </div>

                      {/* 価格表示（モバイルでもしっかり見える） */}
                      <div className="text-right shrink-0">
                        {p.agg.minPrice > 0 ? (
                          <>
                            <p className="text-lg font-bold text-violet-600 dark:text-violet-400 sm:text-xl">
                              {formatPrice(p.agg.minPrice)}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              〜{formatPrice(p.agg.maxPrice)}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-slate-400">価格未取得</p>
                        )}
                      </div>

                      {isExpanded ? (
                        <ChevronUp size={16} className="shrink-0 text-slate-400" />
                      ) : (
                        <ChevronDown size={16} className="shrink-0 text-slate-400" />
                      )}
                    </button>

                    {/* 展開部分 */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/30">
                        <div className="grid gap-4 lg:grid-cols-2">
                          {/* 左: スペックと価格ソース */}
                          <div className="space-y-4">
                            {/* スペック */}
                            <div>
                              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                スペック
                              </h4>
                              <div className="grid grid-cols-2 gap-1">
                                {Object.entries(p.specs).map(([key, val]) => (
                                  <div key={key} className="text-xs">
                                    <span className="text-slate-400">{key}: </span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                      {val}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* 価格ソース一覧 */}
                            <div>
                              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                価格ソース
                              </h4>
                              <div className="space-y-1.5">
                                {p.agg.priceEntries.map((entry) => (
                                  <div
                                    key={entry.id}
                                    className="flex items-center justify-between rounded-lg bg-white px-3 py-2 dark:bg-slate-800"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                        {entry.source}
                                      </span>
                                      {entry.sourceType === "ai_reference" && (
                                        <Badge variant="info">AI参考</Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {formatPrice(entry.price)}
                                      </span>
                                      <ExternalLink size={12} className="text-slate-400" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* 集計情報 */}
                            <div className="grid grid-cols-3 gap-2">
                              <div className="rounded-lg bg-white px-3 py-2 dark:bg-slate-800">
                                <p className="text-[10px] text-slate-400">平均</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                  {formatPrice(p.agg.avgPrice)}
                                </p>
                              </div>
                              <div className="rounded-lg bg-white px-3 py-2 dark:bg-slate-800">
                                <p className="text-[10px] text-slate-400">中央値</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                  {formatPrice(p.agg.medianPrice)}
                                </p>
                              </div>
                              <div className="rounded-lg bg-white px-3 py-2 dark:bg-slate-800">
                                <p className="text-[10px] text-slate-400">発売日</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                  {formatDate(p.releaseDate)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* 右: チャート */}
                          <div>
                            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                              価格推移（30日）
                            </h4>
                            {p.history ? (
                              <PriceChart history={p.history} height={220} />
                            ) : (
                              <div className="flex h-[220px] items-center justify-center rounded-lg bg-white dark:bg-slate-800">
                                <p className="text-xs text-slate-400">履歴データなし</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          );
        }}
      </Tabs>
    </div>
  );
}
