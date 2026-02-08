import type { Tier } from "@/types";
import { cn, tierColor } from "@/lib/utils";

interface TierBadgeProps {
  tier: Tier;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-5 w-5 text-[10px]",
  md: "h-7 w-7 text-xs",
  lg: "h-9 w-9 text-sm",
};

export function TierBadge({ tier, size = "md", className }: TierBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-bold",
        tierColor(tier),
        sizes[size],
        className
      )}
    >
      {tier}
    </span>
  );
}
