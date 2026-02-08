"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TierBadge } from "@/components/ui/tier-badge";
import { Tabs } from "@/components/ui/tabs";
import { products } from "@/data/products";
import { productCandidates } from "@/data/candidates";
import { categoryLabel, formatDate, cn } from "@/lib/utils";
import type { ProductCandidate } from "@/types";
import {
  PackagePlus,
  CheckCircle2,
  XCircle,
  Clock,
  ListChecks,
  Ban,
  Plus,
} from "lucide-react";

const managementTabs = [
  { id: "candidates", label: "新製品候補" },
  { id: "active", label: "監視中" },
  { id: "history", label: "履歴" },
];

export default function ProductsPage() {
  const [candidates, setCandidates] = useState<ProductCandidate[]>(productCandidates);

  const pending = candidates.filter((c) => c.status === "pending");
  const approved = candidates.filter((c) => c.status === "approved");
  const rejected = candidates.filter((c) => c.status === "rejected");
  const activeProducts = products.filter((p) => p.status === "active");

  const handleApprove = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: "approved" as const, reviewNote: "承認済み" }
          : c
      )
    );
  };

  const handleReject = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: "rejected" as const, reviewNote: "却下" }
          : c
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">製品管理</h2>
          <p className="mt-1 text-sm text-slate-500">
            新製品の追加・監視対象の管理
          </p>
        </div>
      </div>

      {/* サマリー */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30">
              <Clock size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{pending.length}</p>
            <p className="text-xs text-slate-500">審査待ち</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
              <CheckCircle2 size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{approved.length}</p>
            <p className="text-xs text-slate-500">承認済み</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-900/30">
              <ListChecks size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{activeProducts.length}</p>
            <p className="text-xs text-slate-500">監視中</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800">
              <Ban size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{rejected.length}</p>
            <p className="text-xs text-slate-500">却下</p>
          </CardContent>
        </Card>
      </div>

      <Tabs tabs={managementTabs} defaultTab="candidates">
        {(activeTab) => {
          if (activeTab === "candidates") {
            return (
              <div className="space-y-3">
                {pending.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <PackagePlus size={32} className="mx-auto mb-3 text-slate-300" />
                      <p className="text-sm text-slate-500">審査待ちの候補はありません</p>
                    </CardContent>
                  </Card>
                ) : (
                  pending.map((c) => (
                    <Card key={c.id} className="border-l-4 border-l-amber-400">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <TierBadge tier={c.suggestedTier} size="lg" />

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                {c.name}
                              </span>
                              <Badge variant="outline">{c.brand}</Badge>
                              <Badge variant="info">{categoryLabel(c.category)}</Badge>
                              <Badge variant="default">
                                {c.deviceType === "desktop" ? "Desktop" : "Laptop"}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-500">
                              情報源: {c.source} | 発見: {formatDate(c.discoveredAt)}
                            </p>
                          </div>

                          <div className="flex shrink-0 gap-2">
                            <button
                              onClick={() => handleApprove(c.id)}
                              className="flex items-center gap-1 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400"
                            >
                              <CheckCircle2 size={14} />
                              採用
                            </button>
                            <button
                              onClick={() => handleReject(c.id)}
                              className="flex items-center gap-1 rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400"
                            >
                              <XCircle size={14} />
                              却下
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}

                {/* 承認済み */}
                {approved.length > 0 && (
                  <div className="mt-6">
                    <h4 className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
                      承認済み ({approved.length})
                    </h4>
                    {approved.map((c) => (
                      <Card key={c.id} className="mb-2 border-l-4 border-l-emerald-400">
                        <CardContent className="flex items-center gap-3 p-3">
                          <TierBadge tier={c.suggestedTier} />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                              {c.name}
                            </span>
                            <span className="ml-2 text-xs text-slate-500">{c.brand}</span>
                          </div>
                          <Badge variant="success">承認済み</Badge>
                          {c.reviewNote && (
                            <span className="text-xs text-slate-500">{c.reviewNote}</span>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          if (activeTab === "active") {
            return (
              <div className="space-y-2">
                {activeProducts.map((p) => (
                  <Card key={p.id}>
                    <CardContent className="flex items-center gap-3 p-3">
                      <TierBadge tier={p.tier} />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {p.name}
                        </span>
                        <span className="ml-2 text-xs text-slate-500">{p.brand}</span>
                      </div>
                      <Badge variant="outline">{categoryLabel(p.category)}</Badge>
                      <Badge variant="default">
                        {p.deviceType === "desktop" ? "Desktop" : "Laptop"}
                      </Badge>
                      <Badge variant="success">監視中</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          }

          // history tab
          return (
            <div className="space-y-2">
              {rejected.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-sm text-slate-500">却下履歴はありません</p>
                  </CardContent>
                </Card>
              ) : (
                rejected.map((c) => (
                  <Card key={c.id} className="opacity-60">
                    <CardContent className="flex items-center gap-3 p-3">
                      <TierBadge tier={c.suggestedTier} />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {c.name}
                        </span>
                        <span className="ml-2 text-xs text-slate-500">{c.brand}</span>
                      </div>
                      <Badge variant="danger">却下</Badge>
                      {c.reviewNote && (
                        <span className="text-xs text-slate-500">{c.reviewNote}</span>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          );
        }}
      </Tabs>
    </div>
  );
}
