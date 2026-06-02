import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/civic/AppShell";
import { citizenNav } from "@/data/nav";
import { mockNotifications } from "@/data/mockData";
import { Bell, CheckCircle2, ThumbsUp, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/citizen/notifications")({ component: NotificationsPage });

const iconFor = { status_change: Bell, resolved: CheckCircle2, upvote: ThumbsUp, emergency: AlertTriangle, system: Info } as const;
const tone = { status_change: "text-primary bg-primary/10", resolved: "text-[var(--success)] bg-[color-mix(in_oklab,var(--success)_14%,transparent)]", upvote: "text-[var(--cat-water)] bg-[color-mix(in_oklab,var(--cat-water)_14%,transparent)]", emergency: "text-[var(--emergency)] bg-[color-mix(in_oklab,var(--emergency)_14%,transparent)]", system: "text-muted-foreground bg-muted" } as const;

function NotificationsPage() {
  return (
    <AppShell role="citizen" navItems={citizenNav} title="Notifications" subtitle={`${mockNotifications.filter((n) => !n.read).length} unread`} contextLabel="Citizen">
      <div className="overflow-hidden rounded-2xl border bg-card divide-y">
        {mockNotifications.map((n) => {
          const I = iconFor[n.type];
          return (
            <div key={n.id} className={cn("flex gap-3 p-4 transition hover:bg-accent/40", !n.read && "bg-primary/[0.04] border-l-2 border-l-primary")}>
              <span className={cn("inline-flex size-9 shrink-0 items-center justify-center rounded-xl", tone[n.type])}><I className="size-4" /></span>
              <div className="min-w-0 flex-1">
                <div className={cn("text-sm", !n.read ? "font-semibold" : "font-medium")}>{n.title}</div>
                <div className="text-xs text-muted-foreground">{n.body}</div>
                <div className="mt-1 text-[11px] text-muted-foreground/70">{n.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
