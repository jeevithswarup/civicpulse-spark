import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Camera, CheckCircle2, MapPin, Navigation, Loader2 } from "lucide-react";
import { AppShell } from "@/components/civic/AppShell";
import { workerNav } from "@/data/nav";
import { CategoryBadge } from "@/components/civic/CategoryBadge";
import { PriorityBadge } from "@/components/civic/PriorityBadge";
import { StatusBadge } from "@/components/civic/StatusBadge";
import { MapPlaceholder } from "@/components/civic/MapPlaceholder";
import { toast } from "sonner";
import {
  getWorkerComplaintDetail,
  workerUpdateComplaint,
  type Complaint,
} from "@/lib/api/complaints";

export const Route = createFileRoute("/worker/tasks/$id")({ component: TaskDetail });

function TaskDetail() {
  const { id } = Route.useParams();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getWorkerComplaintDetail(Number(id));
        setComplaint(data);
        setNotes(data.worker_notes ?? "");
      } catch {
        toast.error("Failed to load task details");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function updateStatus(status: "in_progress" | "resolved") {
    if (!complaint) return;
    setUpdating(true);
    try {
      const updated = await workerUpdateComplaint(complaint.id, { status });
      setComplaint(updated);
      toast.success(status === "resolved" ? "Marked as resolved 🎉" : "Status updated: In Progress");
    } catch {
      toast.error("Update failed");
    } finally {
      setUpdating(false);
    }
  }

  async function saveNotes() {
    if (!complaint) return;
    setUpdating(true);
    try {
      const updated = await workerUpdateComplaint(complaint.id, { worker_notes: notes });
      setComplaint(updated);
      setShowNotes(false);
      toast.success("Notes saved!");
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <AppShell role="worker" navItems={workerNav} title="Loading…" contextLabel="Field Team">
        <div className="flex items-center gap-2 py-20 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading task…
        </div>
      </AppShell>
    );
  }

  if (!complaint) {
    return (
      <AppShell role="worker" navItems={workerNav} title="Not Found" contextLabel="Field Team">
        <div className="py-20 text-center text-muted-foreground">
          Task not found.
          <Link to={"/worker/dashboard" as never} className="mt-2 block text-sm text-primary hover:underline">
            ← Back to tasks
          </Link>
        </div>
      </AppShell>
    );
  }

  const c = complaint;
  const mapComplaint = {
    id: String(c.id),
    location: { lat: Number(c.latitude), lng: Number(c.longitude), address: c.address },
    category: c.category,
    status: c.status,
    priority: c.priority,
    title: c.title,
    description: c.description,
  };

  const isResolved = c.status === "resolved" || c.status === "closed";

  return (
    <AppShell role="worker" navItems={workerNav} title={c.title} subtitle={c.complaintID} contextLabel="Field Team">
      <Link
        to={"/worker/dashboard" as never}
        className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to tasks
      </Link>

      {/* Complaint info */}
      <div className="rounded-2xl border bg-card p-5 shadow-card">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={c.category} />
          <PriorityBadge priority={c.priority} />
          <StatusBadge status={c.status} dot />
        </div>
        <p className="mt-3 text-sm">{c.description}</p>
        <div className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5" /> {c.address}
        </div>
        {c.worker_notes && (
          <div className="mt-3 rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
            <span className="font-semibold">Your notes: </span>{c.worker_notes}
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* Map */}
        <div className="rounded-2xl border bg-card p-3 shadow-card">
          <MapPlaceholder complaints={[mapComplaint as never]} height="h-56" showUserDot={false} />
          <a
            href={`https://maps.google.com/?q=${c.latitude},${c.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border bg-background py-2 text-xs font-medium hover:bg-accent"
          >
            <Navigation className="size-3.5" /> Get directions
          </a>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => { setCheckedIn(true); toast.success("Checked in ✓"); }}
            disabled={checkedIn || isResolved}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-pop hover:opacity-90 disabled:opacity-50"
          >
            <MapPin className="size-4" />
            {checkedIn ? "Checked in ✓" : "GPS Check-in"}
          </button>

          <button
            onClick={() => updateStatus("in_progress")}
            disabled={updating || c.status === "in_progress" || isResolved}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--status-in-progress)] py-3 text-sm font-semibold text-white shadow-pop hover:opacity-90 disabled:opacity-50"
          >
            {updating ? <Loader2 className="size-4 animate-spin" /> : null}
            Mark In Progress
          </button>

          <button
            onClick={() => updateStatus("resolved")}
            disabled={updating || isResolved}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--success)] py-3 text-sm font-semibold text-white shadow-pop hover:opacity-90 disabled:opacity-50"
          >
            {updating ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
            {isResolved ? "Already Resolved" : "Mark Resolved"}
          </button>

          <button
            onClick={() => setShowNotes((s) => !s)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border bg-card py-3 text-sm font-semibold hover:bg-accent"
          >
            <CheckCircle2 className="size-4" />
            {showNotes ? "Cancel notes" : "Add work notes"}
          </button>

          {showNotes && (
            <div className="rounded-xl border bg-card p-3">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Describe the work done…"
                className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
              />
              <button
                onClick={saveNotes}
                disabled={updating}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {updating ? <Loader2 className="size-4 animate-spin" /> : null} Save notes
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
