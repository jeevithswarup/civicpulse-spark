import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, label = true }: { className?: string; label?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-bold", className)}>
      <span className="relative inline-flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[color-mix(in_oklab,var(--primary)_60%,var(--cat-water))] text-white shadow-pop">
        <Shield className="size-4" />
        <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[var(--emergency)] ring-2 ring-background" aria-hidden />
      </span>
      {label && <span className="tracking-tight">CivicPulse</span>}
    </span>
  );
}
