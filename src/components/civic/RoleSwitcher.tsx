import { useNavigate } from "@tanstack/react-router";
import { useRole, dashboardPathForRole } from "@/hooks/useRole";
import type { Role } from "@/data/mockData";
import { Shield, User, Wrench, HardHat } from "lucide-react";
import { cn } from "@/lib/utils";

const items: { role: Role; label: string; icon: typeof Shield }[] = [
  { role: "citizen", label: "Citizen", icon: User },
  { role: "officer", label: "Officer", icon: Shield },
  { role: "worker",  label: "Worker",  icon: HardHat },
  { role: "admin",   label: "Admin",   icon: Wrench },
];

export function RoleSwitcher({ compact, onPicked }: { compact?: boolean; onPicked?: () => void }) {
  const { role, setRole } = useRole();
  const navigate = useNavigate();

  return (
    <div className={cn(
      "inline-flex flex-wrap items-center gap-1 rounded-xl border bg-card p-1 text-xs",
      compact && "text-[11px]",
    )}>
      {items.map(({ role: r, label, icon: Icon }) => {
        const active = r === role;
        return (
          <button
            key={r}
            onClick={() => {
              setRole(r);
              onPicked?.();
              navigate({ to: dashboardPathForRole(r) });
            }}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition",
              active ? "bg-primary text-primary-foreground shadow-card" : "text-muted-foreground hover:text-foreground hover:bg-accent",
            )}
            aria-pressed={active}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
