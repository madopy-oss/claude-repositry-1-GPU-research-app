import { fetchCategoryData } from "@/lib/data-source";
import { ProductList } from "@/components/product-list";

export const dynamic = "force-dynamic";

export default async function GpuPage() {
  const data = await fetchCategoryData("gpu");
  return (
    <ProductList
      category="gpu"
      title="GPU"
      description="グラフィックカードの価格一覧・比較"
      {...data}
    />
  );
}
