import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { citizenNav } from "@/data/nav";
import { AppShell } from "@/components/civic/AppShell";
import { StatusBadge } from "@/components/civic/StatusBadge";
import { PriorityBadge } from "@/components/civic/PriorityBadge";
import { CategoryBadge } from "@/components/civic/CategoryBadge";
import { getMyComplaints, deleteComplaint, type Complaint } from "@/lib/api/complaints";
import { timeAgo } from "@/lib/formatters";
import { Loader2, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/citizen/complaints")({ component: ListPage });

function ListPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  async function load() {
    try {
      const data = await getMyComplaints();
      setComplaints(data);
    } catch {
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: number) {
    if (!confirm("Delete this complaint?")) return;
    setDeleting(id);
    try {
      await deleteComplaint(id);
      setComplaints((prev) => prev.filter((c) => c.id !== id));
      toast.success("Complaint deleted");
    } catch {
      toast.error("Could not delete complaint");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <AppShell
      role="citizen"
      navItems={citizenNav}
      title="My Complaints"
      subtitle={loading ? "Loading…" : `${complaints.length} total`}
      contextLabel="Citizen"
      emergencyCta
      fabHref="/citizen/report"
      fabLabel="Report"
    >
      {loading && (
        <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading your complaints…
        </div>
      )}

      {!loading && complaints.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <p className="text-muted-foreground">You haven't filed any complaints yet.</p>
          <Link
            to={"/citizen/report" as never}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Report an issue
          </Link>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {complaints.map((c) => (
          <div
            key={c.id}
            className="relative rounded-2xl border bg-card p-4 shadow-card transition hover:shadow-card-hover"
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <CategoryBadge category={c.category} />
                <PriorityBadge priority={c.priority} />
              </div>
              <StatusBadge status={c.status} dot />
            </div>

            {/* Title */}
            <Link
              to={"/citizen/complaints/$id" as never}
              params={{ id: String(c.id) } as never}
              className="mt-2 block text-sm font-semibold hover:underline line-clamp-2"
            >
              {c.title}
            </Link>

            {/* Meta */}
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{c.address}</span>
              <span>{timeAgo(c.created_at)}</span>
            </div>

            {/* ID + delete */}
            <div className="mt-3 flex items-center justify-between">
              <span className="font-mono text-[10px] text-muted-foreground">{c.complaintID}</span>
              <button
                onClick={() => handleDelete(c.id)}
                disabled={deleting === c.id}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-[11px] text-destructive hover:bg-destructive/10 disabled:opacity-50"
                )}
              >
                {deleting === c.id ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Trash2 className="size-3" />
                )}
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
