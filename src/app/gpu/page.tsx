import { fetchCategoryData } from "@/lib/data-source";
import { ProductList } from "@/components/product-list";

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
