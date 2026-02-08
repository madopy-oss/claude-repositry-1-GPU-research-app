import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";

export const metadata: Metadata = {
  title: "GPU Price Monitor - ゲーミングPC価格監視",
  description: "CPU/GPU/メモリ/ストレージの最新価格を収集・集計し、S/A/B/C Tierで即断できる価格監視アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="font-sans antialiased">
        <Sidebar />
        <main className="min-h-screen lg:pl-64">
          <div className="mx-auto max-w-7xl px-4 py-6 pt-16 lg:pt-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
