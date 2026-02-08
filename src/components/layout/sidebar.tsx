"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Cpu,
  MonitorSpeaker,
  MemoryStick,
  HardDrive,
  LayoutDashboard,
  ShieldAlert,
  PackagePlus,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/gpu", label: "GPU", icon: MonitorSpeaker },
  { href: "/cpu", label: "CPU", icon: Cpu },
  { href: "/memory", label: "メモリ", icon: MemoryStick },
  { href: "/storage", label: "ストレージ", icon: HardDrive },
  { href: "/quarantine", label: "異常検知", icon: ShieldAlert },
  { href: "/products", label: "製品管理", icon: PackagePlus },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* モバイルハンバーガー */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 rounded-xl bg-white/80 p-2 shadow-lg backdrop-blur-sm lg:hidden dark:bg-slate-800/80"
        aria-label="メニュー切替"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* オーバーレイ */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* サイドバー本体 */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 flex h-full w-64 flex-col border-r border-slate-200 bg-white/95 backdrop-blur-sm transition-transform duration-300 lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900/95",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* ロゴ */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
            GP
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white">GPU Price Monitor</h1>
            <p className="text-[10px] text-slate-500">ゲーミングPC価格監視</p>
          </div>
        </div>

        {/* ナビ */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    )}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* フッタ */}
        <div className="border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <p className="text-[10px] text-slate-400">
            最終更新: 2026/02/07 10:30
          </p>
          <p className="text-[10px] text-slate-400">Phase 1 - MVP</p>
        </div>
      </aside>
    </>
  );
}
