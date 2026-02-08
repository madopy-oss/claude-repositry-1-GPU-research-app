"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/products";
import { priceEntries, anomalyRecords } from "@/data/prices";
import { formatPrice, formatDateTime, categoryLabel } from "@/lib/utils";
import type { AnomalyType } from "@/types";
import {
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Hash,
  Truck,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

const anomalyTypeLabel: Record<AnomalyType, { label: string; icon: typeof AlertTriangle }> = {
  digit_error: { label: "桁ズレ", icon: Hash },
  sudden_spike: { label: "急騰", icon: TrendingUp },
  sudden_drop: { label: "急落", icon: TrendingDown },
  shipping_anomaly: { label: "送料異常", icon: Truck },
  outlier: { label: "外れ値", icon: BarChart3 },
};

const severityColors = {
  high: "border-l-rose-500",
  medium: "border-l-amber-500",
  low: "border-l-slate-400",
};

export default function QuarantinePage() {
  const unresolved = anomalyRecords.filter((a) => !a.resolved);
  const resolved = anomalyRecords.filter((a) => a.resolved);

  const quarantinedEntries = priceEntries.filter((e) => e.isQuarantined);

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">異常検知・隔離</h2>
        <p className="mt-1 text-sm text-slate-500">
          公式集計から除外された価格データの管理
        </p>
      </div>

      {/* サマリー */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900/30">
              <ShieldAlert size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{unresolved.length}</p>
            <p className="text-xs text-slate-500">未解決</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
              <CheckCircle2 size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{resolved.length}</p>
            <p className="text-xs text-slate-500">解決済み</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30">
              <AlertTriangle size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{quarantinedEntries.length}</p>
            <p className="text-xs text-slate-500">隔離エントリ</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-900/30">
              <BarChart3 size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {Math.round((quarantinedEntries.length / priceEntries.length) * 100)}%
            </p>
            <p className="text-xs text-slate-500">隔離率</p>
          </CardContent>
        </Card>
      </div>

      {/* 未解決一覧 */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
          未解決の異常 ({unresolved.length})
        </h3>
        <div className="space-y-3">
          {unresolved.map((ar) => {
            const product = products.find((p) => p.id === ar.productId);
            const entry = priceEntries.find((e) => e.id === ar.priceEntryId);
            const typeInfo = anomalyTypeLabel[ar.type];
            const TypeIcon = typeInfo.icon;

            return (
              <Card
                key={ar.id}
                className={`border-l-4 ${severityColors[ar.severity]}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        ar.severity === "high"
                          ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
                          : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      <TypeIcon size={18} />
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {product?.name}
                        </span>
                        <Badge variant="outline">{categoryLabel(product?.category || "gpu")}</Badge>
                        <Badge
                          variant={ar.severity === "high" ? "danger" : "warning"}
                        >
                          {typeInfo.label}
                        </Badge>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {ar.message}
                      </p>

                      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                        {entry && (
                          <span>ソース: {entry.source}</span>
                        )}
                        <span>
                          検知価格: <span className="font-semibold text-rose-600 dark:text-rose-400">{formatPrice(ar.originalPrice)}</span>
                        </span>
                        <span>
                          許容範囲: {formatPrice(ar.expectedRange.min)} 〜 {formatPrice(ar.expectedRange.max)}
                        </span>
                        <span>検知: {formatDateTime(ar.detectedAt)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 検知ルール説明 */}
      <Card>
        <CardContent className="p-5">
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
            異常検知ルール
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(anomalyTypeLabel).map(([type, info]) => {
              const descriptions: Record<string, string> = {
                digit_error: "他ソースの中央値と桁数が2桁以上異なる価格を検出",
                sudden_spike: "直近平均から50%以上の急騰を検出",
                sudden_drop: "直近平均から50%以上の急落を検出",
                shipping_anomaly: "送料が商品価格の20%超、または5,000円超を検出",
                outlier: "IQR法による統計的外れ値を検出",
              };
              const Icon = info.icon;
              return (
                <div
                  key={type}
                  className="flex items-start gap-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50"
                >
                  <Icon size={14} className="mt-0.5 shrink-0 text-slate-400" />
                  <div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {info.label}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {descriptions[type]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
