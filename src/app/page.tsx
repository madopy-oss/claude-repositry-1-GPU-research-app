import { fetchDashboardData } from "@/lib/data-source";
import { aggregatePrices } from "@/lib/price";
import { DashboardClient } from "@/components/dashboard-client";
import type { PartCategory } from "@/types";

const categories: PartCategory[] = ["gpu", "cpu", "memory", "storage"];

export default async function DashboardPage() {
  const { products, priceEntries, anomalyRecords, priceHistories } =
    await fetchDashboardData();

  // サーバー側で集計
  const categorySummaries = categories.map((cat) => {
    const catProducts = products.filter((p) => p.category === cat && p.status === "active");
    const catAnomalies = anomalyRecords.filter(
      (a) => !a.resolved && catProducts.some((p) => p.id === a.productId)
    );
    return { category: cat, total: catProducts.length, anomalies: catAnomalies.length };
  });

  const featuredByCategory = categories
    .map((cat) => {
      const items = products
        .filter((p) => p.category === cat && (p.tier === "S" || p.tier === "A") && p.status === "active" && p.deviceType === "desktop")
        .map((p) => {
          const agg = aggregatePrices(p.id, priceEntries);
          const history = priceHistories.find((h) => h.productId === p.id);
          return { ...p, agg, history: history ?? null };
        })
        .filter((p) => p.agg.minPrice > 0)
        .sort((a, b) => a.agg.minPrice - b.agg.minPrice);
      return { category: cat, items };
    })
    .filter((g) => g.items.length > 0);

  const totalAnomalies = anomalyRecords.filter((a) => !a.resolved).length;

  const recentAnomalies = anomalyRecords.slice(0, 5).map((ar) => ({
    ...ar,
    productName: products.find((p) => p.id === ar.productId)?.name ?? "不明",
  }));

  return (
    <DashboardClient
      categorySummaries={categorySummaries}
      featuredByCategory={featuredByCategory}
      totalAnomalies={totalAnomalies}
      recentAnomalies={recentAnomalies}
    />
  );
}
