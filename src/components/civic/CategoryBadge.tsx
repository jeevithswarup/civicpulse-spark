import { CATEGORY_BY_KEY } from "@/data/categories";
import type { ComplaintCategory } from "@/data/mockData";
import { cn } from "@/lib/utils";

type Props = {
  category: ComplaintCategory;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
};

export function CategoryBadge({ category, size = "md", showLabel = true, className }: Props) {
  const c = CATEGORY_BY_KEY[category];
  const Icon = c.icon;
  const iconSize = size === "sm" ? "size-3.5" : size === "lg" ? "size-5" : "size-4";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        c.bgClass,
        c.textClass,
        className,
      )}
    >
      <Icon className={iconSize} />
      {showLabel && c.label}
    </span>
  );
}

export function CategoryIcon({ category, className }: { category: ComplaintCategory; className?: string }) {
  const c = CATEGORY_BY_KEY[category];
  const Icon = c.icon;
  return (
    <span
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-xl",
        c.bgClass,
        c.textClass,
        className,
      )}
    >
      <Icon className="size-5" />
    </span>
  );
}
