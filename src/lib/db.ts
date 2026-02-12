import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

/**
 * Prisma クライアントの遅延初期化シングルトン。
 * DB 接続が必要な時にのみインスタンス化される。
 *
 * Prisma 7 は adapter or accelerateUrl を必須にしているが、
 * ランタイムでは DATABASE_URL 環境変数から接続可能。
 * Neon 接続時に @prisma/adapter-neon を導入予定。
 */
export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalForPrisma.prisma = new (PrismaClient as any)();
  }
  return globalForPrisma.prisma as PrismaClient;
}
