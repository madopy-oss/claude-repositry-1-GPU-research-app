import { fetchProductManagementData } from "@/lib/data-source";
import { ProductsClient } from "@/components/products-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "製品管理 | GPU Research",
  description: "新製品の追加・監視対象の管理",
};

export default async function ProductsPage() {
  const { products, candidates } = await fetchProductManagementData();

  return <ProductsClient products={products} candidates={candidates} />;
}
