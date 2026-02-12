import { fetchCategoryData } from "@/lib/data-source";
import { ProductList } from "@/components/product-list";

export default async function MemoryPage() {
  const data = await fetchCategoryData("memory");
  return (
    <ProductList
      category="memory"
      title="メモリ"
      description="DDR5/DDR4メモリの価格一覧・比較"
      {...data}
    />
  );
}
