import { fetchQuarantineData } from "@/lib/data-source";
import { QuarantineClient } from "@/components/quarantine-client";

export const metadata = {
  title: "異常検知・隔離 | GPU Research",
  description: "公式集計から除外された価格データの管理",
};

export default async function QuarantinePage() {
  const { products, priceEntries, anomalyRecords } = await fetchQuarantineData();

  return (
    <QuarantineClient
      products={products}
      priceEntries={priceEntries}
      anomalyRecords={anomalyRecords}
    />
  );
}
