import { fetchDashboardData } from "@/lib/data-source";
import { aggregatePrices } from "@/lib/price";
import { DashboardClient } from "@/components/dashboard-client";
import type { PartCategory } from "@/types";

export const dynamic = "force-dynamic";

const categories: PartCategory[] = ["gpu", "cpu", "memory", "storage"];

export default async function DashboardPage() {
  const { products, priceEntries, anomalyRecords, priceHistories, lastFetchedAt } =
    await fetchDashboardData();

  // サーバー側で集計
  const categorySummaries = categories.map((cat) => {
    const catProducts = products.filter((p) => p.category === cat && p.status === "active");
    const catAnomalies = anomalyRecords.filter(
      (a) => !a.resolved && catProducts.some((p) => p.id === a.productId)
    );
    return { category: cat, total: catProducts.length, anomalies: catAnomalies.length };
  });

  // 全アクティブ製品の集計 (featuredByCategory + bestDeals 両方で使う)
  const allActiveWithAgg = products
    .filter((p) => p.status === "active" && p.deviceType === "desktop")
    .map((p) => {
      const agg = aggregatePrices(p.id, priceEntries);
      const history = priceHistories.find((h) => h.productId === p.id);
      return { ...p, agg, history: history ?? null };
    })
    .filter((p) => p.agg.minPrice > 0);

  const featuredByCategory = categories
    .map((cat) => {
      const items = allActiveWithAgg
        .filter((p) => p.category === cat && (p.tier === "S" || p.tier === "A"))
        .sort((a, b) => a.agg.minPrice - b.agg.minPrice);
      return { category: cat, items };
    })
    .filter((g) => g.items.length > 0);

  // 最安値ランキング (全カテゴリから最安Top10)
  const bestDeals = [...allActiveWithAgg]
    .sort((a, b) => a.agg.minPrice - b.agg.minPrice)
    .slice(0, 10)
    .map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      tier: p.tier,
      minPrice: p.agg.minPrice,
      avgPrice: p.agg.avgPrice,
      sourceCount: p.agg.entryCount,
    }));

  const totalAnomalies = anomalyRecords.filter((a) => !a.resolved).length;

  const recentAnomalies = anomalyRecords.slice(0, 5).map((ar) => ({
    ...ar,
    productName: products.find((p) => p.id === ar.productId)?.name ?? "不明",
  }));

  return (
    <DashboardClient
      categorySummaries={categorySummaries}
      featuredByCategory={featuredByCategory}
      bestDeals={bestDeals}
      totalAnomalies={totalAnomalies}
      recentAnomalies={recentAnomalies}
      lastFetchedAt={lastFetchedAt}
    />
  );
}
