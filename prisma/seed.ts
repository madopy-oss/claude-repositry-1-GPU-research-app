import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";
import { products } from "../src/data/products";
import { priceEntries, priceHistories, anomalyRecords } from "../src/data/prices";
import { productCandidates } from "../src/data/candidates";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Please set it in .env file.");
}

const pool = new Pool({ connectionString: databaseUrl });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaNeon(pool as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new (PrismaClient as any)({ adapter }) as PrismaClient;

async function main() {
  console.log("🌱 シードデータを投入中...");

  // 既存データをクリア（順序重要: FK制約）
  await prisma.anomalyRecord.deleteMany();
  await prisma.priceEntry.deleteMany();
  await prisma.priceHistoryPoint.deleteMany();
  await prisma.productCandidate.deleteMany();
  await prisma.product.deleteMany();
  console.log("  ✓ 既存データをクリア");

  // 製品マスタ
  for (const p of products) {
    await prisma.product.create({
      data: {
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        deviceType: p.deviceType,
        tier: p.tier,
        status: p.status,
        specs: p.specs,
        imageUrl: p.imageUrl ?? null,
        releaseDate: new Date(p.releaseDate),
      },
    });
  }
  console.log(`  ✓ 製品: ${products.length}件`);

  // 価格エントリ
  for (const pe of priceEntries) {
    await prisma.priceEntry.create({
      data: {
        id: pe.id,
        productId: pe.productId,
        source: pe.source,
        sourceType: pe.sourceType,
        price: pe.price,
        shippingCost: pe.shippingCost,
        url: pe.url,
        fetchedAt: new Date(pe.fetchedAt),
        isQuarantined: pe.isQuarantined,
        quarantineReason: pe.quarantineReason ?? null,
      },
    });
  }
  console.log(`  ✓ 価格エントリ: ${priceEntries.length}件`);

  // 価格履歴
  let historyCount = 0;
  for (const h of priceHistories) {
    for (const point of h.points) {
      await prisma.priceHistoryPoint.create({
        data: {
          productId: h.productId,
          date: new Date(point.date),
          minPrice: point.minPrice,
          avgPrice: point.avgPrice,
          maxPrice: point.maxPrice,
        },
      });
      historyCount++;
    }
  }
  console.log(`  ✓ 価格履歴: ${historyCount}件 (${priceHistories.length}製品)`);

  // 異常レコード
  for (const ar of anomalyRecords) {
    await prisma.anomalyRecord.create({
      data: {
        id: ar.id,
        priceEntryId: ar.priceEntryId,
        productId: ar.productId,
        type: ar.type,
        severity: ar.severity,
        detectedAt: new Date(ar.detectedAt),
        message: ar.message,
        originalPrice: ar.originalPrice,
        expectedRange: ar.expectedRange,
        resolved: ar.resolved,
      },
    });
  }
  console.log(`  ✓ 異常レコード: ${anomalyRecords.length}件`);

  // 製品候補
  for (const c of productCandidates) {
    await prisma.productCandidate.create({
      data: {
        name: c.name,
        brand: c.brand,
        category: c.category,
        deviceType: c.deviceType,
        suggestedTier: c.suggestedTier,
        source: c.source,
        discoveredAt: new Date(c.discoveredAt),
        status: c.status,
        reviewNote: c.reviewNote ?? null,
      },
    });
  }
  console.log(`  ✓ 製品候補: ${productCandidates.length}件`);

  console.log("🎉 シード完了！");
}

main()
  .catch((e) => {
    console.error("❌ シード失敗:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
