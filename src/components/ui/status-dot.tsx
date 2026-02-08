import { cn } from "@/lib/utils";

interface StatusDotProps {
  status: "active" | "warning" | "error" | "idle";
  className?: string;
  label?: string;
}

const colors = {
  active: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-rose-500",
  idle: "bg-slate-400",
};

export function StatusDot({ status, className, label }: StatusDotProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className={cn("h-2 w-2 rounded-full", colors[status])} />
      {label && <span className="text-xs text-slate-500">{label}</span>}
    </span>
  );
}
