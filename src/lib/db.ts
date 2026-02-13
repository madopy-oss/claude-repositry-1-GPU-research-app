import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

/**
 * Prisma クライアントの遅延初期化シングルトン。
 * DB 接続が必要な時にのみインスタンス化される。
 *
 * DATABASE_URL が設定されていれば Neon HTTP アダプターで接続。
 * Vercel Serverless + Neon PostgreSQL の推奨構成。
 */
export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not set");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adapter = new PrismaNeonHttp(databaseUrl, {} as any);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalForPrisma.prisma = new (PrismaClient as any)({ adapter });
  }
  return globalForPrisma.prisma as PrismaClient;
}
