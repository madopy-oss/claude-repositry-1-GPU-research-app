import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Tier, PartCategory } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function tierColor(tier: Tier): string {
  const colors: Record<Tier, string> = {
    S: "bg-amber-500 text-white",
    A: "bg-rose-500 text-white",
    B: "bg-sky-500 text-white",
    C: "bg-slate-500 text-white",
  };
  return colors[tier];
}

export function tierBorderColor(tier: Tier): string {
  const colors: Record<Tier, string> = {
    S: "border-l-amber-500",
    A: "border-l-rose-500",
    B: "border-l-sky-500",
    C: "border-l-slate-500",
  };
  return colors[tier];
}

export function categoryLabel(category: PartCategory): string {
  const labels: Record<PartCategory, string> = {
    cpu: "CPU",
    gpu: "GPU",
    memory: "メモリ",
    storage: "ストレージ",
  };
  return labels[category];
}

export function categoryIcon(category: PartCategory): string {
  const icons: Record<PartCategory, string> = {
    cpu: "Cpu",
    gpu: "MonitorSpeaker",
    memory: "MemoryStick",
    storage: "HardDrive",
  };
  return icons[category];
}

export function percentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}
