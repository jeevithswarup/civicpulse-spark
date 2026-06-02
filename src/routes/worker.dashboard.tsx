import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/civic/AppShell";
import { workerNav } from "@/data/nav";
import { mockComplaints } from "@/data/mockData";
import { CategoryIcon } from "@/components/civic/CategoryBadge";
import { PriorityBadge } from "@/components/civic/PriorityBadge";
import { StatusBadge } from "@/components/civic/StatusBadge";
import { MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_BY_KEY } from "@/data/categories";

export const Route = createFileRoute("/worker/dashboard")({ component: WorkerDashboard });

function WorkerDashboard() {
  const tasks = mockComplaints.filter((c) => c.status === "assigned" || c.status === "in_progress");
  return (
    <AppShell role="worker" navItems={workerNav} title="My Tasks" subtitle={`${tasks.length} active`} contextLabel="Roads · Field Team">
      <div className="space-y-3">
        {tasks.map((c) => {
          const cat = CATEGORY_BY_KEY[c.category];
          const isEm = c.priority === "emergency";
          return (
            <Link key={c.id} to={"/worker/tasks/$id" as never} params={{ id: c.id } as never}
              className={cn("relative block overflow-hidden rounded-2xl border bg-card p-4 pl-5 shadow-card transition hover:shadow-card-hover", isEm && "border-[var(--emergency)]/40")}>
              <span aria-hidden className="absolute left-0 top-0 h-full w-1.5" style={{ backgroundColor: cat.hex }} />
              <div className="flex gap-3">
                <CategoryIcon category={c.category} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-sm font-semibold">{c.title}</h3>
                    <PriorityBadge priority={c.priority} />
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" /> {c.location.address}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="size-3.5" /> 1.2km</span>
                  </div>
                  <div className="mt-2"><StatusBadge status={c.status} dot /></div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
