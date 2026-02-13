#!/bin/bash
# Neon DB セットアップスクリプト（スキーマ適用 + シードデータ投入）
# 使い方: ./scripts/setup-db.sh
set -e

echo "=== Neon DB セットアップ ==="
echo ""

# .env チェック
if ! grep -q "^DATABASE_URL=" .env 2>/dev/null; then
  echo "❌ .env に DATABASE_URL が設定されていません"
  echo "   .env ファイルに以下を追加してください:"
  echo '   DATABASE_URL="postgresql://..."'
  exit 1
fi

echo "Step 1/2: スキーマ適用中..."
npx prisma db push
echo ""

echo "Step 2/2: シードデータ投入中..."
npm run db:seed
echo ""

echo "=== セットアップ完了！ ==="
echo "Vercel を再デプロイすれば DB データが表示されます"
