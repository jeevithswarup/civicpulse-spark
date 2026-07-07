import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/civic/AppShell";
import { workerNav } from "@/data/nav";
import { CategoryIcon } from "@/components/civic/CategoryBadge";
import { PriorityBadge } from "@/components/civic/PriorityBadge";
import { StatusBadge } from "@/components/civic/StatusBadge";
import { MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_BY_KEY } from "@/data/categories";
import { getWorkerComplaints, type Complaint } from "@/lib/api/complaints";
import { toast } from "sonner";

export const Route = createFileRoute("/worker/dashboard")({ component: WorkerDashboard });

function WorkerDashboard() {
  const [tasks, setTasks] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getWorkerComplaints();
        // Show only active tasks (not resolved/closed)
        setTasks(data.filter((c) => c.status === "assigned" || c.status === "in_progress"));
      } catch {
        toast.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <AppShell
      role="worker"
      navItems={workerNav}
      title="My Tasks"
      subtitle={loading ? "Loading…" : `${tasks.length} active`}
      contextLabel="Field Team"
    >
      {loading && (
        <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading tasks…
        </div>
      )}

      {!loading && tasks.length === 0 && (
        <div className="py-20 text-center text-sm text-muted-foreground">
          No active tasks assigned to you right now.
        </div>
      )}

      <div className="space-y-3">
        {tasks.map((c) => {
          const cat = CATEGORY_BY_KEY[c.category] ?? CATEGORY_BY_KEY["road"];
          const isEm = c.priority === "emergency";
          return (
            <Link
              key={c.id}
              to={"/worker/tasks/$id" as never}
              params={{ id: String(c.id) } as never}
              className={cn(
                "relative block overflow-hidden rounded-2xl border bg-card p-4 pl-5 shadow-card transition hover:shadow-card-hover",
                isEm && "border-[var(--emergency)]/40"
              )}
            >
              <span
                aria-hidden
                className="absolute left-0 top-0 h-full w-1.5"
                style={{ backgroundColor: cat.hex }}
              />
              <div className="flex gap-3">
                <CategoryIcon category={c.category} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-sm font-semibold">{c.title}</h3>
                    <PriorityBadge priority={c.priority} />
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" /> {c.address}
                    </span>
                  </div>
                  <div className="mt-2">
                    <StatusBadge status={c.status} dot />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
