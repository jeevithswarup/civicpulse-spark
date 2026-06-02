import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  icon: LucideIcon;
  label: string;
  value: number | string;
  trend?: number; // percentage; positive = up
  hint?: string;
  accentClass?: string; // bg-* for icon background
  className?: string;
};

export function StatCard({ icon: Icon, label, value, trend, hint, accentClass, className }: Props) {
  const display = useCountUp(typeof value === "number" ? value : 0);
  const shown = typeof value === "number" ? display.toLocaleString("en-IN") : value;
  const trendUp = (trend ?? 0) >= 0;

  return (
    <div className={cn(
      "group rounded-2xl border bg-card p-4 shadow-card transition hover:shadow-card-hover",
      className,
    )}>
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary",
            accentClass,
          )}
        >
          <Icon className="size-5" />
        </span>
        {trend !== undefined && (
          <span className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
            trendUp ? "text-[var(--success)] bg-[color-mix(in_oklab,var(--success)_14%,transparent)]" : "text-[var(--danger)] bg-[color-mix(in_oklab,var(--danger)_14%,transparent)]",
          )}>
            {trendUp ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mt-3 text-2xl font-bold tracking-tight">{shown}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
      {hint && <div className="mt-1 text-[11px] text-muted-foreground/80">{hint}</div>}
    </div>
  );
}

function useCountUp(target: number, duration = 900) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}
