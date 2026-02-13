import { fetchCategoryData } from "@/lib/data-source";
import { ProductList } from "@/components/product-list";

export const dynamic = "force-dynamic";

export default async function CpuPage() {
  const data = await fetchCategoryData("cpu");
  return (
    <ProductList
      category="cpu"
      title="CPU"
      description="プロセッサの価格一覧・比較"
      {...data}
    />
  );
}
