"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TierBadge } from "@/components/ui/tier-badge";
import { PriceChart } from "@/components/charts/price-chart";
import { formatPrice, categoryLabel } from "@/lib/utils";
import type { PartCategory, Product, AggregatedPrice, PriceHistory, AnomalyRecord } from "@/types";
import {
  Cpu,
  MonitorSpeaker,
  MemoryStick,
  HardDrive,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

const categoryIcons: Record<PartCategory, typeof Cpu> = {
  cpu: Cpu,
  gpu: MonitorSpeaker,
  memory: MemoryStick,
  storage: HardDrive,
};

const categoryColors: Record<PartCategory, string> = {
  gpu: "from-violet-500 to-purple-600",
  cpu: "from-sky-500 to-blue-600",
  memory: "from-emerald-500 to-teal-600",
  storage: "from-amber-500 to-orange-600",
};

interface FeaturedProduct extends Product {
  agg: AggregatedPrice;
  history: PriceHistory | null;
}

interface DashboardClientProps {
  categorySummaries: { category: PartCategory; total: number; anomalies: number }[];
  featuredByCategory: { category: PartCategory; items: FeaturedProduct[] }[];
  totalAnomalies: number;
  recentAnomalies: (AnomalyRecord & { productName: string })[];
}

export function DashboardClient({
  categorySummaries,
  featuredByCategory,
  totalAnomalies,
  recentAnomalies,
}: DashboardClientProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">ダッシュボード</h2>
        <p className="mt-1 text-sm text-slate-500">ゲーミングPCパーツの価格概況</p>
      </div>

      {/* カテゴリサマリー */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {categorySummaries.map((s) => {
          const Icon = categoryIcons[s.category];
          return (
            <Link href={`/${s.category}`} key={s.category}>
              <Card className="group cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${categoryColors[s.category]} text-white`}>
                      <Icon size={20} />
                    </div>
                    {s.anomalies > 0 && <Badge variant="danger">{s.anomalies}件</Badge>}
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">{categoryLabel(s.category)}</h3>
                  <p className="text-xs text-slate-500">{s.total}製品を監視中</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* 異常アラート */}
      {totalAnomalies > 0 && (
        <Link href="/quarantine">
          <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/10">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30">
                <ShieldAlert size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">{totalAnomalies}件の価格異常を検知</p>
                <p className="text-xs text-amber-600 dark:text-amber-500">公式集計から隔離されています。確認してください。</p>
              </div>
              <AlertTriangle size={16} className="text-amber-500" />
            </CardContent>
          </Card>
        </Link>
      )}

      {/* 注目製品（カテゴリ別） */}
      {featuredByCategory.map((group) => {
        const Icon = categoryIcons[group.category];
        return (
          <div key={group.category}>
            <div className="mb-3 flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${categoryColors[group.category]} text-white`}>
                <Icon size={14} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{categoryLabel(group.category)}</h3>
              <span className="text-xs text-slate-400">Tier S/A</span>
              <Link href={`/${group.category}`} className="ml-auto text-xs font-medium text-violet-600 hover:text-violet-800 dark:text-violet-400">
                すべて見る →
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
              {group.items.map((p) => (
                <Card key={p.id} className="w-[260px] shrink-0 overflow-hidden transition-all hover:shadow-md sm:w-[280px]">
                  <CardHeader className="pb-1">
                    <div className="flex items-center gap-2">
                      <TierBadge tier={p.tier} />
                      <div className="flex-1 min-w-0">
                        <CardTitle className="truncate text-sm">{p.name}</CardTitle>
                        <p className="text-xs text-slate-500">{p.brand}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">最安値</p>
                        <p className="text-xl font-bold text-violet-600 dark:text-violet-400">{formatPrice(p.agg.minPrice)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">平均</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{formatPrice(p.agg.avgPrice)}</p>
                      </div>
                    </div>
                    {p.history && <PriceChart history={p.history} height={100} compact />}
                    <p className="text-[10px] text-slate-400">{p.agg.entryCount}ソースから集計</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {/* 最近の異常検知 */}
      {recentAnomalies.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">最近の異常検知</h3>
          <Card>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentAnomalies.map((ar) => (
                <div key={ar.id} className="flex items-center gap-3 px-5 py-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    ar.severity === "high" ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
                    : ar.severity === "medium" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}>
                    {ar.type === "sudden_spike" ? <TrendingUp size={14} /> : ar.type === "sudden_drop" ? <TrendingDown size={14} /> : <AlertTriangle size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{ar.productName}</p>
                    <p className="truncate text-xs text-slate-500">{ar.message}</p>
                  </div>
                  <Badge variant={ar.severity === "high" ? "danger" : ar.severity === "medium" ? "warning" : "default"}>
                    {ar.severity === "high" ? "高" : ar.severity === "medium" ? "中" : "低"}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
