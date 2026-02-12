import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

/**
 * Prisma クライアントの遅延初期化シングルトン。
 * DB 接続が必要な時にのみインスタンス化される。
 *
 * DATABASE_URL が設定されていれば Neon アダプターで接続。
 * Vercel Serverless + Neon PostgreSQL の推奨構成。
 */
export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not set");
    }

    const pool = new Pool({ connectionString: databaseUrl });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adapter = new PrismaNeon(pool as any);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalForPrisma.prisma = new (PrismaClient as any)({ adapter });
  }
  return globalForPrisma.prisma as PrismaClient;
}
