import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction, className }: Props) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card/60 px-6 py-12 text-center",
      className,
    )}>
      <div className="relative mb-4">
        <div className="absolute inset-0 -z-10 rounded-full bg-primary/10 blur-2xl" aria-hidden />
        <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="size-7" />
        </span>
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>}
      {actionLabel && (
        <Button className="mt-4" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
