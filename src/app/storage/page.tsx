import { fetchCategoryData } from "@/lib/data-source";
import { ProductList } from "@/components/product-list";

export default async function StoragePage() {
  const data = await fetchCategoryData("storage");
  return (
    <ProductList
      category="storage"
      title="ストレージ"
      description="SSD/NVMeの価格一覧・比較"
      {...data}
    />
  );
}
