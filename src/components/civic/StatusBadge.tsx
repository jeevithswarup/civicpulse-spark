import { STATUSES } from "@/data/categories";
import { cn } from "@/lib/utils";

type Props = {
  status: string;
  dot?: boolean;
  className?: string;
};

export function StatusBadge({ status, dot, className }: Props) {
  const s = STATUSES[status] ?? STATUSES.submitted;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        s.bgClass,
        s.textClass,
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {s.label}
    </span>
  );
}
