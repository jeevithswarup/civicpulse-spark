import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Share2, ThumbsUp, Copy, Loader2 } from "lucide-react";
import { AppShell } from "@/components/civic/AppShell";
import { citizenNav } from "@/data/nav";
import { StatusBadge } from "@/components/civic/StatusBadge";
import { PriorityBadge } from "@/components/civic/PriorityBadge";
import { CategoryBadge } from "@/components/civic/CategoryBadge";
import { MapPlaceholder } from "@/components/civic/MapPlaceholder";
import { toast } from "sonner";
import { getMyComplaints, supportComplaint, type Complaint } from "@/lib/api/complaints";
import { timeAgo } from "@/lib/formatters";

export const Route = createFileRoute("/citizen/complaints/$id")({ component: DetailPage });

function DetailPage() {
  const { id } = Route.useParams();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [supporting, setSupporting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        // Fetch all my complaints and find the one matching the id param
        const all = await getMyComplaints();
        const found = all.find((c) => String(c.id) === id || c.complaintID === id);
        setComplaint(found ?? null);
      } catch {
        toast.error("Failed to load complaint details");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSupport() {
    if (!complaint) return;
    setSupporting(true);
    try {
      await supportComplaint(complaint.id);
      setComplaint((prev) => prev ? { ...prev, support_count: prev.support_count + 1 } : prev);
      toast.success("Support added!");
    } catch {
      toast.error("Could not add support");
    } finally {
      setSupporting(false);
    }
  }

  if (loading) {
    return (
      <AppShell role="citizen" navItems={citizenNav} title="Loading…" contextLabel="Citizen" emergencyCta>
        <div className="flex items-center gap-2 py-20 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading complaint…
        </div>
      </AppShell>
    );
  }

  if (!complaint) {
    return (
      <AppShell role="citizen" navItems={citizenNav} title="Not Found" contextLabel="Citizen" emergencyCta>
        <div className="py-20 text-center text-muted-foreground">
          <p>Complaint not found.</p>
          <Link to={"/citizen/complaints" as never} className="mt-2 inline-block text-sm text-primary hover:underline">← Back to complaints</Link>
        </div>
      </AppShell>
    );
  }

  const c = complaint;

  // Build a minimal mock-compatible shape for MapPlaceholder
  const mapComplaint = {
    id: String(c.id),
    location: { lat: Number(c.latitude), lng: Number(c.longitude), address: c.address },
    category: c.category,
    status: c.status,
    priority: c.priority,
    title: c.title,
    description: c.description,
  };

  return (
    <AppShell role="citizen" navItems={citizenNav} title={c.title} subtitle={c.complaintID} contextLabel="Citizen" emergencyCta>
      {/* Top bar */}
      <div className="mb-4 flex items-center gap-2">
        <Link
          to={"/citizen/complaints" as never}
          className="inline-flex items-center gap-1 rounded-lg border bg-card px-2.5 py-1.5 text-xs hover:bg-accent"
        >
          <ArrowLeft className="size-3.5" /> Back
        </Link>
        <button
          onClick={() => { navigator.clipboard?.writeText(c.complaintID); toast.success("ID copied"); }}
          className="inline-flex items-center gap-1 rounded-lg border bg-card px-2.5 py-1.5 text-xs hover:bg-accent"
        >
          <Copy className="size-3.5" /> {c.complaintID}
        </button>
        <button
          onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }}
          className="ml-auto inline-flex items-center gap-1 rounded-lg border bg-card px-2.5 py-1.5 text-xs hover:bg-accent"
        >
          <Share2 className="size-3.5" /> Share
        </button>
        <StatusBadge status={c.status} dot />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-5 lg:col-span-2">
          {/* Complaint info */}
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={c.category} />
              <PriorityBadge priority={c.priority} />
            </div>
            <h2 className="mt-3 text-lg font-bold">{c.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" /> {c.address}
              </span>
              <span>Filed {timeAgo(c.created_at)}</span>
              {c.resolved_at && <span>Resolved {timeAgo(c.resolved_at)}</span>}
            </div>
          </div>

          {/* Worker notes (if any) */}
          {c.worker_notes && (
            <div className="rounded-2xl border bg-card p-5 shadow-card">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Worker Notes
              </h3>
              <p className="text-sm text-muted-foreground">{c.worker_notes}</p>
            </div>
          )}

          {/* Timeline */}
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Status Timeline
            </h3>
            <StatusTimeline complaint={c} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Support / upvote */}
          <button
            onClick={handleSupport}
            disabled={supporting}
            className="flex w-full items-center justify-between rounded-2xl border bg-card p-4 shadow-card transition hover:shadow-card-hover disabled:opacity-60"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {supporting ? <Loader2 className="size-5 animate-spin" /> : <ThumbsUp className="size-5" />}
              </span>
              <div className="text-left">
                <div className="text-sm font-semibold">{c.support_count} supports</div>
                <div className="text-xs text-muted-foreground">Show support for this issue</div>
              </div>
            </div>
            <span className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
              Support
            </span>
          </button>

          {/* Map */}
          <div className="rounded-2xl border bg-card p-3 shadow-card">
            <MapPlaceholder complaints={[mapComplaint as never]} height="h-56" showUserDot={false} />
            <a
              href={`https://maps.google.com/?q=${c.latitude},${c.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block w-full rounded-lg border bg-background py-2 text-center text-xs font-medium hover:bg-accent"
            >
              Open in Google Maps
            </a>
          </div>

          {/* Complaint metadata */}
          <div className="rounded-2xl border bg-card p-4 shadow-card space-y-2 text-sm">
            <Row label="Complaint ID" value={c.complaintID} mono />
            <Row label="Category" value={c.category} />
            <Row label="Status" value={<StatusBadge status={c.status} />} />
            <Row label="Priority" value={<PriorityBadge priority={c.priority} />} />
            {c.assignedOfficer && <Row label="Officer ID" value={String(c.assignedOfficer)} />}
            {c.assignedWorker && <Row label="Worker ID" value={String(c.assignedWorker)} />}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono text-xs" : "text-xs font-medium"}>{value}</span>
    </div>
  );
}

// Simple status timeline based on complaint data
function StatusTimeline({ complaint: c }: { complaint: Complaint }) {
  const ALL_STATUSES = ["pending", "assigned", "in_progress", "resolved"] as const;
  const currentIdx = ALL_STATUSES.indexOf(c.status as typeof ALL_STATUSES[number]);

  const LABELS: Record<string, string> = {
    pending: "Complaint filed",
    assigned: "Officer assigned",
    in_progress: "Work in progress",
    resolved: "Issue resolved",
    closed: "Closed",
  };

  return (
    <ol className="space-y-3">
      {ALL_STATUSES.map((s, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        return (
          <li key={s} className="flex items-start gap-3">
            <span
              className={`mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold
                ${done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              {done ? "✓" : i + 1}
            </span>
            <div>
              <div className={`text-sm font-medium ${active ? "text-primary" : done ? "" : "text-muted-foreground"}`}>
                {LABELS[s]}
              </div>
              {active && s === "resolved" && c.resolved_at && (
                <div className="text-[11px] text-muted-foreground">{timeAgo(c.resolved_at)}</div>
              )}
              {active && s !== "resolved" && (
                <div className="text-[11px] text-muted-foreground">Current status</div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
