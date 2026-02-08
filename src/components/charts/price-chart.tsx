"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { PriceHistory } from "@/types";
import { formatPrice } from "@/lib/utils";

interface PriceChartProps {
  history: PriceHistory;
  height?: number;
  compact?: boolean;
}

export function PriceChart({ history, height = 240, compact = false }: PriceChartProps) {
  const data = history.points.map((p) => ({
    ...p,
    date: p.date.slice(5), // MM-DD表示
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: compact ? -20 : 0, bottom: 0 }}>
        <defs>
          <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        {!compact && (
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
          />
        )}
        {!compact && (
          <YAxis
            tickFormatter={(v: number) => `${Math.round(v / 1000)}K`}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            width={45}
          />
        )}
        <Tooltip
          formatter={(value: number | undefined) => [value != null ? formatPrice(value) : "", ""]}
          labelFormatter={(label) => `日付: ${label}`}
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            fontSize: "12px",
          }}
        />
        <Area
          type="monotone"
          dataKey="minPrice"
          stroke="#10b981"
          strokeWidth={1.5}
          fill="none"
          name="最安値"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="avgPrice"
          stroke="#8b5cf6"
          strokeWidth={2}
          fill="url(#priceGrad)"
          name="平均"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="maxPrice"
          stroke="#f59e0b"
          strokeWidth={1.5}
          fill="none"
          name="最高値"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
