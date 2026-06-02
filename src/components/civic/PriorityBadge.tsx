import { PRIORITIES } from "@/data/categories";
import type { ComplaintPriority } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export function PriorityBadge({ priority, className }: { priority: ComplaintPriority; className?: string }) {
  const p = PRIORITIES[priority];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        p.bgClass,
        p.textClass,
        priority === "emergency" && "civic-pulse",
        className,
      )}
    >
      {priority === "emergency" && <AlertTriangle className="size-3" />}
      {p.label}
    </span>
  );
}
